import db from "./db.server";

export async function createPost(title: string, content: string) {
  return db.post.create({
    data: {
      title,
      content,
    },
  });
}

export async function getPosts() {
  return db.post.findMany({
    orderBy: {createdAt: "desc"},
  });
}

export async function deletePost(id: string) {
  try {
    await db.post.delete({
      where: {
        id,
      },
    });
    return {success: true};
  } catch (error) {
    console.error("Error deleting post:", error);
    return {success: false, error: "Failed to delete post"};
  }
}
