import { db } from "@/lib/db";


// ADMIN DASHBOARD QUERIES

// Fetch total status counts for certificate requests
export const getAdminCertificateStatusCounts = async () => {
  const status = await db.certificateRequest.findMany({
    select: {
      status: true,
    },
  });
  
  const pendingCount = status.filter((s) => s.status === "PENDING").length;
  const processingCount = status.filter((s) => s.status === "PROCESSING").length;
  const completedCount = status.filter((s) => s.status === "COMPLETED").length;

  return { pendingCount, processingCount, completedCount };
};

// Fetch total user count and new user statistics
export const getAdminUserStats = async () => {
  const totalUsers = await db.user.count();
  const newUsersThisMonth = await db.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(1)), // First day of current month
      },
    },
  });
  
  return { totalUsers, newUsersThisMonth };
};

// Fetch payment statistics
export const getAdminPaymentStats = async () => {
  const totalPayments = await db.payment.count({
    where: {
      paymentStatus: "SUCCEEDED",
    },
  });
  
  const totalAmount = await db.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      paymentStatus: "SUCCEEDED",
    },
  });

  const pendingPayments = await db.payment.count({
    where: {
      paymentStatus: "PENDING",
    },
  });

  return { 
    totalPayments, 
    totalAmount: totalAmount._sum.amount || 0,
    pendingPayments,
  };
};

// Fetch resident statistics
export const getAdminResidentStats = async () => {
  const totalResidents = await db.resident.count();
  const newResidentsThisMonth = await db.resident.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(1)), // First day of current month
      },
    },
  });
  
  return { totalResidents, newResidentsThisMonth };
};

// Fetch recent certificate requests for admin dashboard
export const getAdminRecentCertificates = async () => {
  const certificates = await db.certificateRequest.findMany({
    take: 5,
    orderBy: {
      requestDate: "desc",
    },
    include: {
      resident: {
        select: {
          firstName: true,
          lastName: true,
          bahayToroSystemId: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          paymentStatus: true,
          amount: true,
          paymentDate: true,
          isActive: true,
        },
      },
    },
  });

  const totalCount = await db.certificateRequest.count();
  
  return { certificates, totalCount };
};

// Fetch upcoming appointments for admin dashboard
export const getAdminUpcomingAppointments = async () => {
  const appointments = await db.appointment.findMany({
    take: 5,
    where: {
      status: {
        in: ["SCHEDULED", "REQUESTED"],
      },
      scheduledDateTime: {
        gte: new Date(),
      },
    },
    orderBy: {
      scheduledDateTime: "asc",
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      resident: {
        select: {
          firstName: true,
          lastName: true,
          bahayToroSystemId: true,
        },
      },
    },
  });

  const totalCount = await db.appointment.count({
    where: {
      status: {
        in: ["SCHEDULED", "REQUESTED"],
      },
      scheduledDateTime: {
        gte: new Date(),
      },
    },
  });
  
  return { appointments, totalCount };
};

// USER DASHBOARD QUERIES

// Fetch user's certificate requests
export const getUserCertificates = async (userId: number) => {
  return await db.certificateRequest.findMany({
    take: 5,
    where: {
      resident: {
        userId: userId,
      },
    },
    orderBy: {
      requestDate: "desc",
    },
    include: {
      resident: {
        select: {
          firstName: true,
          lastName: true,
          bahayToroSystemId: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          paymentStatus: true,
          amount: true,
          paymentDate: true,
          isActive: true,
        },
      },
    },
  });
};

// Fetch user's pending payments
export const getUserPendingPayments = async (userId: number) => {
  return await db.payment.count({
    where: {
      certificateRequest: {
        resident: {
          userId: userId,
        },
      },
      paymentStatus: "PENDING",
      isActive: true,
    },
  });
};

// Fetch user's upcoming appointments
export const getUserAppointments = async (userId: number) => {
  return await db.appointment.findMany({
    take: 5,
    where: {
      userId: userId,
      status: {
        in: ["SCHEDULED", "REQUESTED"],
      },
      scheduledDateTime: {
        gte: new Date(),
      },
    },
    orderBy: {
      scheduledDateTime: "asc",
    },
    include: {
      resident: {
        select: {
          firstName: true,
          lastName: true,
          bahayToroSystemId: true,
        },
      },
    },
  });
};

// Fetch user's resident profiles
export const getUserResidents = async (userId: number) => {
  return await db.resident.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      bahayToroSystemId: true,
      gender: true,
      birthDate: true,
      certificateRequests: {
        take: 1,
        orderBy: {
          requestDate: "desc",
        },
      },
    },
  });
};

// Get certificate status counts for user dashboard
export const getUserCertificateStatusCounts = async (userId: number) => {
  const pendingCount = await db.certificateRequest.count({
    where: {
      resident: {
        userId: userId,
      },
      status: "PENDING",
    },
  });
  
  const processingCount = await db.certificateRequest.count({
    where: {
      resident: {
        userId: userId,
      },
      status: {
        in: ["PROCESSING", "UNDER_REVIEW", "AWAITING_PAYMENT"],
      },
    },
  });
  
  const completedCount = await db.certificateRequest.count({
    where: {
      resident: {
        userId: userId,
      },
      status: "COMPLETED",
    },
  });
  
  const readyForPickupCount = await db.certificateRequest.count({
    where: {
      resident: {
        userId: userId,
      },
      status: "READY_FOR_PICKUP",
    },
  });
  
  return { pendingCount, processingCount, completedCount, readyForPickupCount };
};
