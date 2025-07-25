import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const EMAIL_TEMPLATES = {
  WELCOME: (name: string): EmailTemplate => ({
    subject: "Welcome to Research Management System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Research Management System</h1>
        <p>Dear ${name},</p>
        <p>Welcome to our Research Management System! Your account has been created successfully.</p>
        <p>You can now:</p>
        <ul>
          <li>Submit research proposals</li>
          <li>Track project progress</li>
          <li>Collaborate with team members</li>
          <li>Generate reports</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),

  ACCOUNT_APPROVED: (name: string): EmailTemplate => ({
    subject: "Your Research Account Has Been Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Account Approved!</h1>
        <p>Dear ${name},</p>
        <p>Great news! Your researcher account has been approved by our administrators.</p>
        <p>You now have full access to:</p>
        <ul>
          <li>Submit research proposals</li>
          <li>Manage your projects</li>
          <li>Access all system features</li>
        </ul>
        <p>You can log in to your account and start using all the features immediately.</p>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),

  PROPOSAL_SUBMITTED: (name: string, proposalTitle: string): EmailTemplate => ({
    subject: "Proposal Submitted Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Proposal Submitted</h1>
        <p>Dear ${name},</p>
        <p>Your research proposal "<strong>${proposalTitle}</strong>" has been submitted successfully.</p>
        <p>What happens next:</p>
        <ol>
          <li>Initial review by our team</li>
          <li>Peer review process</li>
          <li>Committee evaluation</li>
          <li>Final decision notification</li>
        </ol>
        <p>You will receive email notifications at each stage of the review process.</p>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),

  PROPOSAL_APPROVED: (name: string, proposalTitle: string): EmailTemplate => ({
    subject: "Proposal Approved - Congratulations!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Proposal Approved!</h1>
        <p>Dear ${name},</p>
        <p>Congratulations! Your research proposal "<strong>${proposalTitle}</strong>" has been approved.</p>
        <p>Next steps:</p>
        <ul>
          <li>Your project will be created automatically</li>
          <li>You'll receive project management access</li>
          <li>Budget allocation will be processed</li>
          <li>You can start project activities</li>
        </ul>
        <p>Please log in to your account to access your new project dashboard.</p>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),

  PROPOSAL_REJECTED: (name: string, proposalTitle: string, reason: string): EmailTemplate => ({
    subject: "Proposal Review Decision",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Proposal Review Decision</h1>
        <p>Dear ${name},</p>
        <p>Thank you for submitting your research proposal "<strong>${proposalTitle}</strong>".</p>
        <p>After careful review, we regret to inform you that your proposal was not approved at this time.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <h3>Feedback:</h3>
          <p>${reason}</p>
        </div>
        <p>We encourage you to:</p>
        <ul>
          <li>Review the feedback provided</li>
          <li>Consider revising and resubmitting</li>
          <li>Contact our support team for guidance</li>
        </ul>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),

  PROJECT_MILESTONE: (name: string, projectTitle: string, milestone: string): EmailTemplate => ({
    subject: "Project Milestone Reminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Milestone Reminder</h1>
        <p>Dear ${name},</p>
        <p>This is a reminder about an upcoming milestone for your project "<strong>${projectTitle}</strong>".</p>
        <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3>Milestone: ${milestone}</h3>
          <p>Please ensure all deliverables are completed on time.</p>
        </div>
        <p>You can track your progress and update milestone status in your project dashboard.</p>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),

  PASSWORD_RESET: (name: string, resetLink: string): EmailTemplate => ({
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Password Reset</h1>
        <p>Dear ${name},</p>
        <p>You requested a password reset for your Research Management System account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>Research Management Team</p>
      </div>
    `,
  }),
}

export async function sendWelcomeEmail(to: string, name: string) {
  const template = EMAIL_TEMPLATES.WELCOME(name)
  return sendEmail({ to, ...template })
}

export async function sendAccountApprovedEmail(to: string, name: string) {
  const template = EMAIL_TEMPLATES.ACCOUNT_APPROVED(name)
  return sendEmail({ to, ...template })
}

export async function sendProposalSubmittedEmail(to: string, name: string, proposalTitle: string) {
  const template = EMAIL_TEMPLATES.PROPOSAL_SUBMITTED(name, proposalTitle)
  return sendEmail({ to, ...template })
}

export async function sendProposalApprovedEmail(to: string, name: string, proposalTitle: string) {
  const template = EMAIL_TEMPLATES.PROPOSAL_APPROVED(name, proposalTitle)
  return sendEmail({ to, ...template })
}

export async function sendProposalRejectedEmail(to: string, name: string, proposalTitle: string, reason: string) {
  const template = EMAIL_TEMPLATES.PROPOSAL_REJECTED(name, proposalTitle, reason)
  return sendEmail({ to, ...template })
}

export async function sendProjectMilestoneEmail(to: string, name: string, projectTitle: string, milestone: string) {
  const template = EMAIL_TEMPLATES.PROJECT_MILESTONE(name, projectTitle, milestone)
  return sendEmail({ to, ...template })
}

export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
  const template = EMAIL_TEMPLATES.PASSWORD_RESET(name, resetLink)
  return sendEmail({ to, ...template })
}
