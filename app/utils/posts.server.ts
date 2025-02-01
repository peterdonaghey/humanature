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
