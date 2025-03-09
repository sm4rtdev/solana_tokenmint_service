'use client'
import { Button } from "@/components/ui/button"
import { clusterApiUrl, Connection, Keypair, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js"
import { AuthorityType, createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToCheckedInstruction, createSetAuthorityInstruction, ExtensionType, getAssociatedTokenAddressSync, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CropperRef, Cropper, } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { connectSolana, getSolanaProvider } from "@/utils/web3"
import { removeFile, saveToken, uploadFile } from "@/utils/api"
import { createInitializeInstruction, pack, TokenMetadata } from "@solana/spl-token-metadata"
import { Loader2 } from "lucide-react"
import { useGlobalContext } from "@/context/global-context"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"


export default function CreateToken() {
    const { user } = useGlobalContext();
    const router = useRouter();
    const avatarRef = useRef<HTMLInputElement>(null);
    const [imgFile, setImgFile] = useState<File>();
    const [fileInfo, setFileInfo] = useState<{ name: string, type: string }>();
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<string>();
    const [preview, setPreview] = useState<string>();
    const [name, setName] = useState<string>();
    const [symbol, setSymbol] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [decimal, setDecimal] = useState<number>(9);
    const [supply, setSupply] = useState<number>(1_000_000);
    const [open, setOpen] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [creator, setCreator] = useState({
        name: "Sixcool",
        site: process.env.NEXT_PUBLIC_ORIGIN || "https://mint-solana-token.vercel.app"
    })
    const [telegram, setTelegram] = useState("");
    const [discord, setDiscord] = useState("");
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");

    const download = (mint: Keypair) => {
        const url = URL.createObjectURL(new Blob([`[${mint.secretKey.toString()}]`]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${mint.publicKey.toBase58()}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
    }
    const onChooseImage = () => {
        if (avatarRef.current?.files![0]) {
            // console.log(avatarRef.current?.files![0]);
            const file = avatarRef.current.files[0];
            setOpen(true);
            setFileInfo(file)
            const url = URL.createObjectURL(file)
            setImage(url);
            // avatarRef.current.value = '';
        }
    }
    const onCrop = () => {
        setOpen(false);
        if (cropperRef.current && avatarRef.current) {
            avatarRef.current.value = '';
            const canvas = cropperRef.current?.getCanvas({ width: 128, height: 128 });
            if (canvas) {
                canvas.toBlob(blob => {
                    blob && setImgFile(new File([blob], fileInfo?.name!, { type: 'image/png' }));
                }, 'image/png');
                setPreview(canvas.toDataURL());
            }
        }
    }
    const onCancel = () => {
        setOpen(false);
        if (cropperRef.current && avatarRef.current) {
            setImgFile(avatarRef.current.files![0]);
            setPreview(image);
            avatarRef.current.value = '';
        }
    }

    const createToken = async () => {
        if (!user) {
            router.push('/auth/signin?redirect=/create', {scroll: true})
        }
        if (!name) {
            toast.warn("Input the token name!");
            return;
        }
        if (!symbol) {
            toast.warn("Input the token symbol!");
            return;
        }
        if (!description) {
            toast.warn("Input the token description!");
            return;
        }
        if (!preview || !imgFile) {
            toast.warn("Choose the token avatar!");
            return;
        }
        const payer = await connectSolana();
        if (!payer) {
            toast.warn("Failed to connect your wallet!");
            return;
        }
        setSpinner(true);
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const mint = Keypair.generate();

        const image = await uploadFile(imgFile, fileInfo?.name!, fileInfo?.type, 'token-asset');
        if (!image) return;
        const extensions : {[key: string]: string} | undefined = (!telegram && !discord && !website && !twitter) ? undefined : {};
        if (extensions) {
            if (telegram) extensions.telegram = telegram;
            if (discord) extensions.discord = discord;
            if (twitter) extensions.twitter = twitter;
            if (website) extensions.website = website;
        }
        const str = JSON.stringify({
            name,
            symbol,
            description,
            image,
            creator,
            extensions
        }, null, 4);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
            type: "application/json;charset=utf-8"
        });
        const metaFile = await uploadFile(new File([blob], 'metadata.json', { type: "application/json;charset=utf-8" }), 'metadata.json', "application/json;charset=utf-8", 'token-asset')
        if (!metaFile) return;
        const metadata: TokenMetadata = {
            mint: mint.publicKey,
            name,
            symbol,
            uri: metaFile,
            additionalMetadata: [["description", "Only Possible On Solana"]],
        };
        const mintLen = getMintLen([
            ExtensionType.MetadataPointer
        ]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const programId = TOKEN_2022_PROGRAM_ID;

        const ata = getAssociatedTokenAddressSync(mint.publicKey, payer, false, programId);

        const instructions_create = [
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mint.publicKey,
                space: mintLen,
                lamports,
                programId
            }),
            createInitializeMetadataPointerInstruction(mint.publicKey, payer, mint.publicKey, programId),
            createInitializeMintInstruction(mint.publicKey, decimal, payer, null, programId),
            createInitializeInstruction({
                programId,
                mint: mint.publicKey,
                metadata: mint.publicKey,
                name,
                symbol,
                uri: metaFile,
                mintAuthority: payer,
                updateAuthority: payer
            })
        ]
        const instructions_mint = [
            createAssociatedTokenAccountInstruction(
                payer,
                ata,
                payer,
                mint.publicKey,
                programId
            ),
            createMintToCheckedInstruction(
                mint.publicKey,
                ata,
                payer,
                supply * 10 ** decimal,
                decimal,
                [],
                programId
            ),
            createSetAuthorityInstruction(
                mint.publicKey,
                payer,
                AuthorityType.MintTokens,
                null,
                [],
                programId
            )
        ]
        try {
            const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            const transactionV0_create = new VersionedTransaction(
                new TransactionMessage({
                    payerKey: payer,
                    recentBlockhash,
                    instructions: instructions_create,
                }).compileToV0Message()
            );
            transactionV0_create.sign([mint])
            const transactionV0_mint = new VersionedTransaction(
                new TransactionMessage({
                    payerKey: payer,
                    recentBlockhash,
                    instructions: instructions_mint
                }).compileToV0Message()
            );
            const provider = getSolanaProvider();
            const signedTransactions = await provider.signAllTransactions([transactionV0_create, transactionV0_mint])
            for (const signedTransaction of signedTransactions) {
                const signature = await connection.sendTransaction(signedTransaction);
                await connection.confirmTransaction(signature);
                console.log(`Transaction confirmed with signature: ${signature}`);
            }
            saveToken(mint.publicKey.toBase58(), name, symbol, description, image, supply, decimal);
            download(mint);
            toast.success(<p>Token mint success! Please check your wallet or <a target="_blank" href={`https://explorer.solana.com/address/${mint.publicKey.toBase58()}?cluster=devnet`}>here</a>.</p>)
            router.push("/tokens", {scroll: true})
        } catch (e) {
            console.log("Error:", e);
            removeFile(image);
            removeFile(metaFile);
            toast.error("Token mint failed! Try again later.")
        }
        setSpinner(false);
    }

    useEffect(() => {
        if (!user) {
            router.push('/auth/signin?redirect=/create', {scroll: true})
        }
    }, [])

    return (
        <div className="flex flex-col gap-4 py-8 md:w-[42rem] mx-auto">
            <div className="w-full flex gap-3 sm:gap-8 justify-between">
                <div className="w-3/5 flex flex-col items-center gap-2">
                    <div className="w-full">
                        <Label>Token name*</Label>
                        <Input placeholder="Token name" className="bg-[#090909]" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <Label>Token symbol*</Label>
                        <Input placeholder="Token symbol, e.g. USDT" className="bg-[#090909]" value={symbol} onChange={e => setSymbol(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <Label>Token decimal*</Label>
                        <Input type="number" placeholder="Token decimal" className="bg-[#090909]" value={decimal} onChange={e => setDecimal(parseInt(e.target.value))} />
                    </div>
                    <div className="w-full">
                        <Label>Token supply*</Label>
                        <Input type="number" placeholder="Token supply" className="bg-[#090909]" value={supply} onChange={e => setSupply(parseInt(e.target.value))} />
                    </div>
                </div>
                <div className="w-2/5 relative">
                    <Label>Token avatar*</Label>
                    <Input type="file" ref={avatarRef} accept="image/png"  onChange={onChooseImage} className="cursor-pointer border border-gray rounded-md h-64 w-full object-contain absolute z-10 opacity-0" />
                    <div className="border border-[#afafaf5c] bg-[#090909] rounded-md h-64 w-full absolute"></div>
                    {preview && <img
                        src={preview}
                        className="border rounded-md h-64 w-full object-contain absolute"
                    />}
                </div>
            </div>
            <div className="w-full">
                <Label>Token description*</Label>
                <Textarea placeholder="Token description" className="bg-[#090909]" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
                <div className="w-full">
                    <Label>Telegram (Optional)</Label>
                    <Input placeholder="https://t.me/" className="bg-[#090909]" value={telegram} onChange={e => setTelegram(e.target.value)} />
                </div>
                <div className="w-full">
                    <Label>Discord (Optional)</Label>
                    <Input placeholder="https://discord.gg/" className="bg-[#090909]" value={discord} onChange={e => setDiscord(e.target.value)} />
                </div>
                <div className="w-full">
                    <Label>Twitter (Optional)</Label>
                    <Input placeholder="https://x.com/" className="bg-[#090909]" value={twitter} onChange={e => setTwitter(e.target.value)} />
                </div>
                <div className="w-full">
                    <Label>Website (Optional)</Label>
                    <Input placeholder="https://" className="bg-[#090909]" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
            </div>
            <div className="w-full flex justify-end mt-4">
                <Button onClick={createToken} disabled={spinner} className="w-2/5 rounded-full bg-gradient-to-b to-[#301060] from-[#9434d3] hover:to-[#4f2b84] hover:from-[#6e20a3]">
                    {spinner ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating token...
                        </>
                    ) : (
                        "Create token"
                    )}
                </Button>
            </div>

            <Dialog open={open} modal={true}>
                <DialogContent className="bg-[#121212] border-[#fff4]">
                    <DialogHeader>
                        <DialogTitle>Crop Image</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        stencilProps={{
                            aspectRatio: 1
                        }}
                    />
                    <DialogFooter>
                        <Button className="bg-gradient-to-b to-[#301060] from-[#9434d3] hover:to-[#4f2b84] hover:from-[#6e20a3]" onClick={onCrop}>Crop</Button>
                        <Button className="bg-gradient-to-b to-[#301060] from-[#9434d3] hover:to-[#4f2b84] hover:from-[#6e20a3]" onClick={onCancel}>Uncrop</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}