import db from "./db.server";

export async function createProject(name: string, description: string) {
  return db.project.create({
    data: {
      name,
      description,
    },
  });
}

export async function getProjects() {
  return db.project.findMany({
    orderBy: {createdAt: "desc"},
    include: {
      posts: true,
    },
  });
}

export async function getProject(id: string) {
  return db.project.findUnique({
    where: {id},
    include: {
      posts: true,
    },
  });
}

export async function updateProject(
  id: string,
  name: string,
  description: string
) {
  return db.project.update({
    where: {id},
    data: {
      name,
      description,
    },
  });
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({
      where: {id},
    });
    return {success: true};
  } catch (error) {
    console.error("Error deleting project:", error);
    return {success: false, error: "Failed to delete project"};
  }
}
