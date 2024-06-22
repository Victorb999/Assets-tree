export interface Location {
  id: string;
  name: string;
  parentId?: string;
}

export interface Asset {
  id: string;
  locationId?: string;
  name: string;
  parentId?: string;
  sensorType?: string;
  status?: string;
  gatewayId?: string;
  sensorId?: string;
}
