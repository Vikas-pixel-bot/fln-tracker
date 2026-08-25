"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Initialize Prisma directly for the edge case where proxy isn't used
const prisma = new PrismaClient();

export async function getActiveExternalDashboards() {
  try {
    const dashboards = await prisma.externalDashboard.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return dashboards;
  } catch (error) {
    console.error("Failed to fetch active external dashboards:", error);
    return [];
  }
}

export async function getAllExternalDashboards() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const dashboards = await prisma.externalDashboard.findMany({
      orderBy: { order: "asc" },
    });
    return dashboards;
  } catch (error) {
    console.error("Failed to fetch all external dashboards:", error);
    return [];
  }
}

export async function createExternalDashboard(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const newDashboard = await prisma.externalDashboard.create({
      data,
    });
    
    revalidatePath("/dashboards");
    revalidatePath("/admin/dashboards");
    return { success: true, data: newDashboard };
  } catch (error: any) {
    console.error("Failed to create external dashboard:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExternalDashboard(
  id: string,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const updatedDashboard = await prisma.externalDashboard.update({
      where: { id },
      data,
    });
    
    revalidatePath("/dashboards");
    revalidatePath("/admin/dashboards");
    return { success: true, data: updatedDashboard };
  } catch (error: any) {
    console.error("Failed to update external dashboard:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExternalDashboard(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.externalDashboard.delete({
      where: { id },
    });
    
    revalidatePath("/dashboards");
    revalidatePath("/admin/dashboards");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete external dashboard:", error);
    return { success: false, error: error.message };
  }
}

export async function getDashboardHeaderConfig() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "dashboard_header_title",
            "dashboard_header_description",
            "dashboard_header_image",
            "dashboard_header_link",
          ],
        },
      },
    });

    const configMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      title: configMap["dashboard_header_title"] || "Program Implementation Dashboards",
      description: configMap["dashboard_header_description"] || "These dashboards are to track the progress of माझी शाळा, माझा स्वाभिमान program being implemented in 500 Ashramschools of Tribal Development Department, Maharashtra for the holistic development of Ashramschools.",
      imageUrl: configMap["dashboard_header_image"] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      linkUrl: configMap["dashboard_header_link"] || "",
    };
  } catch (error) {
    console.error("Failed to fetch dashboard header config:", error);
    return {
      title: "Program Implementation Dashboards",
      description: "These dashboards are to track the progress of माझी शाळा, माझा स्वाभिमान program being implemented in 500 Ashramschools of Tribal Development Department, Maharashtra for the holistic development of Ashramschools.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      linkUrl: "",
    };
  }
}

export async function updateDashboardHeaderConfig(data: {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const updates = [
      prisma.systemSetting.upsert({
        where: { key: "dashboard_header_title" },
        update: { value: data.title },
        create: { key: "dashboard_header_title", value: data.title },
      }),
      prisma.systemSetting.upsert({
        where: { key: "dashboard_header_description" },
        update: { value: data.description },
        create: { key: "dashboard_header_description", value: data.description },
      }),
      prisma.systemSetting.upsert({
        where: { key: "dashboard_header_image" },
        update: { value: data.imageUrl },
        create: { key: "dashboard_header_image", value: data.imageUrl },
      }),
      prisma.systemSetting.upsert({
        where: { key: "dashboard_header_link" },
        update: { value: data.linkUrl || "" },
        create: { key: "dashboard_header_link", value: data.linkUrl || "" },
      }),
    ];

    await prisma.$transaction(updates);

    revalidatePath("/dashboards");
    revalidatePath("/admin/dashboards");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update dashboard header config:", error);
    return { success: false, error: error.message };
  }
}

