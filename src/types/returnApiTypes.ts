export interface Location {
  id: string;
  name: string;
  parentId?: string;
}

export interface Asset {
  gatewayId?: string;
  id: string;
  locationId?: string;
  name: string;
  parentId?: string;
  sensorId?: string;
  sensorType?: string;
  status?: string;
}
