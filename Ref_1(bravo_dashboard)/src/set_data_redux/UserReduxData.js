import { DashboardApi } from "../utils/service/DashboardService";

export const fetchDashboardData = async () => {
    try {
        const response = await DashboardApi();
        return response;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to load dashboard data');
    }
};
