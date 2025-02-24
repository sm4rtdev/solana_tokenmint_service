'use client'
import { Button } from "@/components/ui/button"
import { clusterApiUrl, Connection, Keypair, SystemProgram } from "@solana/web3.js"
import { createInitializeMintInstruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
import { useRef, useState } from "react"
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { connectSolana } from "@/utils/web3"


export default function CreateToken() {
    const [mint, setMint] = useState<Keypair>();
    const avatarRef = useRef<HTMLInputElement>(null);
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
            setOpen(true);
            const url = URL.createObjectURL(avatarRef.current.files[0])
            setImage(url);
            avatarRef.current.value = '';
        }
    }
    const onCrop = () => {
        setOpen(false);
        const canvas = cropperRef.current?.getCanvas({width:128, height:128});
        setPreview(canvas?.toDataURL());
    }

    const createToken = async () => {
        // if (!name) return;
        // if (!symbol) return;
        // if (!description) return;
        // if (!preview) return;
        // const connection = new Connection(clusterApiUrl("devnet"));
        // const payer = await connectSolana();
        // if (!mint) return;
        // if (!payer) return;
        // const lamports = await getMinimumBalanceForRentExemptMint(connection);
        // const programId = TOKEN_2022_PROGRAM_ID;
        // const instructionCreateAccount = SystemProgram.createAccount({
        //     fromPubkey: payer,
        //     newAccountPubkey: mint.publicKey,
        //     space: MINT_SIZE,
        //     lamports,
        //     programId
        // });
        // const instructionInitMint = createInitializeMintInstruction(
        //     mint.publicKey,
        //     decimal,
        //     payer,
        //     null,
        //     programId
        // )
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
                    <Input type="file" ref={avatarRef} accept="image/*" onChange={onChooseImage}/>
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