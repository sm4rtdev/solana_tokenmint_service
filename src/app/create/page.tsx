'use client'
import { Button } from "@/components/ui/button"
import { clusterApiUrl, Connection, Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMint, ExtensionType, getMinimumBalanceForRentExemptMint, getMintLen, LENGTH_SIZE, MINT_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token"
import { useRef, useState } from "react"
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { connectSolana, getSolanaProvider } from "@/utils/web3"
import { removeFile, uploadFile } from "@/utils/api"
import { createInitializeInstruction, pack, TokenMetadata } from "@solana/spl-token-metadata"


export default function CreateToken() {
    const [mint, setMint] = useState<Keypair>();
    const avatarRef = useRef<HTMLInputElement>(null);
    const [imgFile, setImgFile] = useState<File>();
    const [fileInfo, setFileInfo] = useState<{name: string, type: string}>();
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<string>();
    const [preview, setPreview] = useState<string>();
    const [name, setName] = useState<string>();
    const [symbol, setSymbol] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [decimal, setDecimal] = useState<number>(9);
    const [supply, setSupply] = useState<number>(1_000_000_000_000_000);
    const [payer, setPayer] = useState();
    const [open, setOpen] = useState(false);
    
    const genKeyPair = () => {
        const key = Keypair.generate();
        setMint(key);
    }
    const download = () => {
        if (mint) {
            const url = URL.createObjectURL(new Blob([`[${mint.secretKey.toString()}]`]))
            const a = document.createElement('a')
            a.href = url
            a.download = `${mint.publicKey.toBase58()}.json`
            document.body.appendChild(a)
            a.click()
            a.remove()
        }
    }
    const onChooseImage = () => {
        if (avatarRef.current?.files![0]) {
            const file = avatarRef.current.files[0];
            setOpen(true);
            console.log("file", file)
            setFileInfo(file)
            const url = URL.createObjectURL(file)
            setImage(url);
            avatarRef.current.value = '';
        }
    }
    const onCrop = () => {
        setOpen(false);
        const canvas = cropperRef.current?.getCanvas({width:128, height:128});
        canvas?.toBlob(blob => {
            blob && setImgFile(new File([blob], fileInfo?.name!, {type: 'image/png'}));
        }, 'image/png');
        setPreview(canvas?.toDataURL());
    }

    const createToken = async () => {
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
        const connection = new Connection(clusterApiUrl("devnet"));
        const payer = await connectSolana();
        if (!mint) {
            toast.warn("Generate token mint address!");
            return;
        }
        if (!payer) {
            toast.warn("Failed to connect your wallet!");
            return;
        }

        const image = await uploadFile(imgFile, fileInfo?.name!, fileInfo?.type, 'token-asset');
        if (!image) return;
        console.log("uploaded image", image);
        const str = JSON.stringify({
            name,
            symbol,
            description,
            image
        }, null, 4);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
            type: "application/json;charset=utf-8"
        });
        const metaFile = await uploadFile(new File([blob], 'metadata.json', {type: "application/json;charset=utf-8"}), 'metadata.json', "application/json;charset=utf-8", 'token-asset')
        if (!metaFile) return;
        console.log("uploaded metafile", metaFile)
        const metadata: TokenMetadata = {
            mint: mint.publicKey,
            name,
            symbol,
            uri: metaFile,
            additionalMetadata: [[description, "Only Possible On Solana"]],
        };
        const mintLen = getMintLen([
            ExtensionType.TransferFeeConfig, 
            ExtensionType.MetadataPointer
        ]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
        
        const programId = TOKEN_2022_PROGRAM_ID;
        const transaction = new Transaction().add(
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
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = payer;
        try {
            const { signature } = await getSolanaProvider().signAndSendTransaction(transaction);
            console.log("signature", signature);
        } catch (e) {
            console.log("Error:", e);
            removeFile(image);
            removeFile(metaFile)
        }
    }

    return (
        <div className="flex flex-col gap-8 px-16 py-32 w-[50rem] mx-auto">
            <div className="w-full">
                <Label>Token Mint Address</Label>
                <div className="flex justify-between items-center gap-4 w-full">
                    <span className="border border-gray flex-1 rounded h-10 leading-10 px-4" onClick={() => {
                        if (mint) {
                            navigator.clipboard.writeText(mint?.publicKey.toBase58())
                            toast("Address copied!")
                        }
                    }}>{mint?.publicKey.toBase58()}</span>
                    <Button onClick={genKeyPair}>Generate</Button>
                    <Button onClick={download}>Download</Button>
                </div>
            </div>
            <div className="w-full flex gap-8 justify-between">
                <div className="w-3/5 flex flex-col items-center gap-4">
                    <div className="w-full">
                        <Label>Token name*</Label>
                        <Input placeholder="Token name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <Label>Token symbol*</Label>
                        <Input placeholder="Token symbol, e.g. USDT" value={symbol} onChange={e => setSymbol(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <Label>Token decimal*</Label>
                        <Input type="number" placeholder="Token decimal" value={decimal} onChange={e => setDecimal(parseInt(e.target.value))} />
                    </div>
                    <div className="w-full">
                        <Label>Token supply*</Label>
                        <Input type="number" placeholder="Token supply" value={supply} onChange={e => setSupply(parseInt(e.target.value))} />
                    </div>
                </div>
                <div className="w-2/5">
                    <Label>Token avatar*</Label>
                    <Input type="file" ref={avatarRef} accept="image/png" onChange={onChooseImage}/>
                    <img className="mt-4 border border-gray rounded-md h-56 w-full object-contain" src={preview}/>
                </div>
            </div>
            <div className="w-full">
                <Label>Token description*</Label>
                <Input placeholder="Token description" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="w-full">
                <Button onClick={createToken}>Create token</Button>
            </div>

            <Dialog open={open} modal={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crop Image</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Cropper 
                        ref={cropperRef}
                        src={image}
                        stencilProps={{
                            aspectRatio: 1,
                        }}
                    />
                    <DialogFooter>
                        <Button onClick={onCrop}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}