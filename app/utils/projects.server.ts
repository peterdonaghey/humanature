import db from "./db.server";
import {deleteFromS3} from "./aws.server";

export async function createProject(
  name: string,
  description: string,
  banner?: string
) {
  return db.project.create({
    data: {
      name,
      description,
      banner: banner || null,
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
      documents: true,
    },
  });
}

export async function updateProject(
  id: string,
  name: string,
  description: string,
  banner?: string,
  currentBanner?: string | null
) {
  // If the banner is being changed or removed, delete the old one from S3
  if (currentBanner && currentBanner !== banner) {
    try {
      await deleteFromS3(currentBanner);
      console.log(`Successfully deleted old banner from S3: ${currentBanner}`);
    } catch (error) {
      console.error(
        `Failed to delete old banner from S3: ${currentBanner}`,
        error
      );
      // Continue with the update even if S3 deletion fails
    }
  }

  return db.project.update({
    where: {id},
    data: {
      name,
      description,
      banner: banner || null,
    },
  });
}

export async function deleteProject(id: string) {
  try {
    // First get the project with all related data
    const project = await getProject(id);

    if (!project) {
      return {success: false, error: "Project not found"};
    }

    // Delete all documents and their S3 files
    for (const document of project.documents) {
      try {
        await deleteFromS3(document.url);
        console.log(`Successfully deleted document from S3: ${document.url}`);
      } catch (error) {
        console.error(
          `Failed to delete document from S3: ${document.url}`,
          error
        );
        // Continue with other deletions even if one fails
      }
    }

    // Delete all posts and their banners from S3
    for (const post of project.posts) {
      if (post.banner) {
        try {
          await deleteFromS3(post.banner);
          console.log(
            `Successfully deleted post banner from S3: ${post.banner}`
          );
        } catch (error) {
          console.error(
            `Failed to delete post banner from S3: ${post.banner}`,
            error
          );
          // Continue with other deletions even if one fails
        }
      }
    }

    // Delete the project from database (this will cascade delete posts and documents due to foreign key constraints)
    await db.project.delete({
      where: {id},
    });

    // If project had a banner, delete it from S3
    if (project.banner) {
      try {
        await deleteFromS3(project.banner);
        console.log(
          `Successfully deleted project banner from S3: ${project.banner}`
        );
      } catch (error) {
        console.error(
          `Failed to delete project banner from S3: ${project.banner}`,
          error
        );
        // Don't fail the whole operation if S3 deletion fails
      }
    }

    return {success: true};
  } catch (error) {
    console.error("Error deleting project:", error);
    return {success: false, error: "Failed to delete project"};
  }
}
