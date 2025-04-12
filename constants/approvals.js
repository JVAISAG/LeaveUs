const APPROVAL_STATUS = {
  PENDING: "Pending",
  ADVISOR_APPROVED: "AdvisorApproved",
  WARDEN_APPROVED: "WardenApproved",
  HOD_APPROVED: "HODApproved",
  DEAN_APPROVED: "DeanApproved",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

const ROLE = {
  ADVISOR: "Advisor",
  WARDEN: "Warden",
  HOD: "HOD",
  DEAN: "DEAN",
  CHIEF_WARDEN: "CHIEF_WARDEN"
};

const STATUS = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PENDING: "Pending",
};

module.exports = {
  APPROVAL_STATUS,
  ROLE,
  STATUS,
};
