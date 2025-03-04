'use client'
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { uploadFile } from "@/utils/api"
const Profile = () => {
    const avatarRef = useRef<HTMLInputElement>(null);
    const [imgFile, setImgFile] = useState<File>();
    const [fileInfo, setFileInfo] = useState<{ name: string, type: string }>();
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<string>();
    const [preview, setPreview] = useState<string>();
    const [name, setName] = useState<string>();
    const [open, setOpen] = useState(false);

    const onChooseImage = () => {
        if (avatarRef.current?.files![0]) {
            const file = avatarRef.current.files[0];
            setOpen(true);
            setFileInfo(file)
            const url = URL.createObjectURL(file)
            setImage(url);
            avatarRef.current.value = '';
        }
    }
    const onCrop = () => {
        setOpen(false);
        const canvas = cropperRef.current?.getCanvas({ width: 128, height: 128 });
        canvas?.toBlob(blob => {
            blob && setImgFile(new File([blob], fileInfo?.name!, { type: 'image/png' }));
        }, 'image/png');
        setPreview(canvas?.toDataURL());
    }
    const onCancel = () => {
        setOpen(false);
        setImgFile(avatarRef.current?.files![0]);
        setPreview(image);
    }

    const GetProfile = async (email: string) => {
        const reponse = await fetch(`/api/users?email=${email}`,
            {
                method: 'GET',
            }
        )
        const data = await reponse.json();
        setName(data.name);
        setPreview(data.avatar);
    }
    useEffect(() => {
        const email = localStorage.getItem('email');
        GetProfile(email);
    }, [])

    const SaveProfile = async () => {
        if (!name) {
            toast.warn("Input the your name!");
            return;
        }
        if (!preview || !imgFile) {
            toast.warn("Choose the your avatar!");
            return;
        }

        const image = await uploadFile(imgFile, fileInfo?.name!, fileInfo?.type, 'avatar');
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            await fetch(
                '/api/users',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + token,
                    },
                    body: JSON.stringify({
                        name: name,
                        avatar: image
                    }),
                }
            ).then(async (response) => {
                if (!response.ok) {
                    toast.error("Failed to update the profile!");
                    return;
                }
                const { token } = await response.json();
                localStorage.setItem('token', token);
                toast.success("Profile updated successfully!");
            })
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to update the profile!");
            return;
        }
    }

    return (
        <div className="flex flex-col gap-8 px-16 py-32 w-[50rem] mx-auto">
            <div className="w-full flex gap-8 justify-between">
                <div className="w-3/5 flex flex-col items-center gap-4">
                    <div className="w-full">
                        <Label>Your name*</Label>
                        <Input placeholder="Token name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <div className="w-2/5 relative">
                    <Label>Your avatar*</Label>
                    <Input type="file" ref={avatarRef} accept="image/png" onChange={onChooseImage} className="mt-4 border border-gray rounded-md h-56 w-full object-contain absolute z-10 opacity-0" />
                    <img
                        src={preview}
                        className="mt-4 border border-gray rounded-md h-56 w-full object-contain absolute"
                    />
                </div>
            </div>
            <div className="w-full">
                <Button onClick={SaveProfile}>Save Profile</Button>
            </div>
            <Dialog open={open} modal={true} >
                <DialogContent>
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
                        <Button onClick={onCrop}>Crop</Button>
                        <Button onClick={onCancel}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>)

}
export default Profile;