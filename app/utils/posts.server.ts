import db from "./db.server";

export async function createPost(
  title: string,
  content: string,
  projectId: string,
  documentUrl?: string | null
) {
  return db.post.create({
    data: {
      title,
      content,
      documentUrl,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });
}

export async function getPosts() {
  return db.post.findMany({
    orderBy: {createdAt: "desc"},
    include: {
      project: true,
      author: true,
    },
  });
}

export async function getPostsByProject(projectId: string) {
  return db.post.findMany({
    where: {
      projectId,
    },
    orderBy: {createdAt: "desc"},
    include: {
      project: true,
    },
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
