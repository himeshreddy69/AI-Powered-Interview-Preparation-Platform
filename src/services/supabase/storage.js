import supabase from "./supabase";

export async function uploadResume(file, uid) {
  if (!file) throw new Error("No file selected");

  const fileExt = file.name.split(".").pop();
  const fileName = `${uid}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(fileName, file);

  if (error) throw error;

  return data.path;
}

export async function uploadProfileImage(file, uid) {
  if (!file) throw new Error("No image selected");

  const fileExt = file.name.split(".").pop();
  const fileName = `${uid}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

export async function getResumeUrl(path) {
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(path, 60);

  if (error) throw error;

  return data.signedUrl;
}