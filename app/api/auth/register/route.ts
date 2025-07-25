import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, researcherData } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: role || "RESEARCHER",
          isActive: true,
        },
      });

      // Create researcher profile if provided
      let researcher = null;
      if (researcherData && (role === "RESEARCHER" || role === "SUPERVISOR")) {
        researcher = await tx.researcher.create({
          data: {
            userId: user.id,
            designation: researcherData.title,
            // firstName: researcherData.firstName,
            // lastName: researcherData.lastName,
            // email: researcherData.email || email,
            phone: researcherData.phone,
            employeeNumber: researcherData.employeeNumber,
            departmentId: researcherData.departmentId,
            isApproved: false, // Requires approval
          },
        });
      }

      return { user, researcher };
    });

    // Create audit log
    await createAuditLog({
      entityName: "User",
      entityId: result.user.id,
      userId: result.user.id,
      action: "CREATE",
      newDataJSON: JSON.stringify({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      }),
    });

    return NextResponse.json({
      message: "User created successfully",
      userId: result.user.id,
      requiresApproval: !!result.researcher,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
