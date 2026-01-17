import { api } from "../libray/axios"; // ✅ file api em đã có sẵn
import { API_ROUTE } from "../const/apiRouter";

interface FilterItem {
  label: string;
  values: string[];
}

interface CreateNodeAttributeBody {
  project_id: string;

}

// 🧩 Hàm call API POST
export const createOFF = async (body: CreateNodeAttributeBody) => {
  try {
   const response = await api.post(API_ROUTE.CREATE_NODEATTRIBUTE, body, {
  params: {
    type_control: "all",
    value: 0,
    rs: 0,
  },
});

    console.log("✅ API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error calling createNodeAttribute:", error);
    throw error;
  }
};
