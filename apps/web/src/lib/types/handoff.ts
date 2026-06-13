// Handoffs alinhados com API.
export type HandoffStatus = "PENDING" | "ACKNOWLEDGED";
export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT";

export interface HandoffSummaryData {
  text: string;
  data: {
    wardName: string;
    shiftType: string;
    patients: Array<{
      name: string;
      bed: string;
      diagnosis: string;
      openConducts: string[];
      alerts: string[];
    }>;
  };
}

export interface HandoffAck {
  id: string;
  handoffId: string;
  userId: string;
  acknowledgedAt: string;
  user?: { name: string; role: string };
}

export interface ShiftHandoff {
  id: string;
  wardId: string;
  fromShiftId: string;
  toShiftId?: string | null;
  generatedAt: string;
  summaryJson: HandoffSummaryData;
  status: HandoffStatus;
  ward?: { id: string; name: string };
  fromShift?: { id: string; type: ShiftType; nurse?: { name: string } };
  toShift?: { id: string; type: ShiftType; nurse?: { name: string } } | null;
  acks?: HandoffAck[];
}
