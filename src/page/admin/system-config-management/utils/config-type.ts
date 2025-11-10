export const getConfigTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "General":
      return "default" as const;
    case "PaymentGateway":
      return "secondary" as const;
    case "Notification":
      return "outline" as const;
    case "Security":
      return "destructive" as const;
    default:
      return "default" as const;
  }
};

