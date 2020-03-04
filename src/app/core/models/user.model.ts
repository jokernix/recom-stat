export interface User {
  id: number;
  name: string;
  last_activity: Date | string;
  email: string;
  // organizations (Array[#/definitions/Organization, optional): Organizations,
  // projects (Array[#/definitions/ProjectWithStatus, optional): Projects
}
