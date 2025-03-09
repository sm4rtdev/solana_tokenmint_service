'use client'
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { removeFile, updateUser, uploadFile } from "@/utils/api"
import { useGlobalContext } from "@/context/global-context";
import { useRouter } from "next/navigation";
const Profile = () => {
    const avatarRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { user, setUser } = useGlobalContext();
    const [imgFile, setImgFile] = useState<File>();
    const [fileInfo, setFileInfo] = useState<{ name: string, type: string }>();
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<string>("");
    const [preview, setPreview] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setName(user?user.name:"")
        setPreview(user?user.avatar:"")
    }, [user])

    const onChooseImage = () => {
        if (avatarRef.current?.files![0]) {
            const file = avatarRef.current.files[0];
            setOpen(true);
            setFileInfo(file)
            const url = URL.createObjectURL(file)
            setImage(url);
        }
    }
    const onCrop = () => {
        setOpen(false);
        if (cropperRef.current && avatarRef.current) {
            avatarRef.current.value = '';
            const canvas = cropperRef.current.getCanvas({ width: 128, height: 128 });
            if (canvas) {
                canvas.toBlob(blob => {
                    blob && setImgFile(new File([blob], fileInfo?.name!, { type: fileInfo?.type }));
                }, fileInfo?.type);
                setPreview(canvas.toDataURL());
            }
        }
    }
    const onCancel = () => {
        setOpen(false);
        setImgFile(avatarRef.current?.files![0]);
        setPreview(image);
    }

    const SaveProfile = async () => {
        if (!user) {
            router.push("/auth/signin?redirect=/profile", {scroll: true});
        }
        if (!name) {
            toast.warn("Input the your name!");
            return;
        }
        let avatar = null;
        if (imgFile) {
            avatar = await uploadFile(imgFile, fileInfo?.name!, fileInfo?.type, 'avatar');
            removeFile(user!.avatar);
        }

        try {
            const res = await updateUser(name, avatar || preview);
            if (res) {
                setUser({email: user? user.email: "", name, avatar: avatar || preview})
                toast.success("Profile updated successfully!");
            }
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to update the profile!");
            return;
        }
    }

    return (
        <div className="flex flex-col gap-8 px-8 pt-16 mx-auto">
            <div className="w-full flex flex-col gap-8 justify-center items-center">
                <div className="w-full flex justify-center relative mb-60">
                    <Input type="file" ref={avatarRef} accept="image/*" onChange={onChooseImage} className="cursor-pointer mt-4 border border-gray h-56 w-56 rounded-full object-contain absolute z-10 opacity-0" />
                    <div className="mt-4 border border-[#afafaf5c] bg-[#090909] h-56 aspect-[1/1] rounded-full absolute"></div>
                    {preview && <img
                        src={preview}
                        className="mt-4 border h-56 aspect-[1/1] rounded-full object-contain absolute"
                    />}
                </div>
                <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-56">
                        <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-[#090909]"/>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <Button onClick={SaveProfile} className="w-56 rounded-full bg-gradient-to-b to-[#301060] from-[#9434d3] hover:to-[#4f2b84] hover:from-[#6e20a3]">Save Profile</Button>
            </div>
            <Dialog open={open} modal={true} >
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
        </div>)

}
export default Profile;