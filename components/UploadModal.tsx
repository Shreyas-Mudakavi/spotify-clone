"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";

const UploadModal = () => {
  const supabaseClient = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      // Reset the form
      reset();

      uploadModal.onClose();
      return;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // here values will be the author, title, song, and image
    try {
      setIsLoading(true);

      const imageFile = values?.image?.[0];
      const songFile = values?.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields!");
        return;
      }

      const uniqID = uniqid();

      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values?.title}-${uniqID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        }); // here we have selected the songs bucket storage that we have created in supabase and in the upload we will create a uniq name

      if (songError) {
        setIsLoading(false);
        toast.error("Failed song upload!");
        return;
      }

      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values?.title}-${uniqID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        toast.error("Failed image upload!");
        return;
      }

      // we will now create a record in our database, in songs table
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user?.id,
          title: values?.title,
          author: values?.author,
          image_path: imageData?.path,
          song_path: songData?.path,
        });
      // so here we selected the table using from the 'songs' and inserted values

      if (supabaseError) {
        setIsLoading(false);
        toast.error(supabaseError.message);
        return;
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song uploaded!");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Something went wrong!");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      onChange={onChange}
      isOpen={uploadModal.isOpen}
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Upload
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
