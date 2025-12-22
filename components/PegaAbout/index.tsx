import { Card, Image, Stack, Text } from "@mantine/core";
import styles from "./Interact.module.css";


export default function DetailInteractive() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {/* ===== Giới thiệu mô hình dự án ===== */}
        <div className={styles.introWrapper}>
         <Text fw={600} size="lg" ta="center" mb="sm" c="#762f0b">
  Giới thiệu  dự án
</Text>
         
        </div>

        {/* ===== Danh sách dự án ===== */}
        <div className={styles.cardGrid}>
          {/* Card 1 */}
             <Card
            // shadow="sm"
            // radius="md"
            // withBorder
            // padding="0"
            // className={styles.card}
          >
            
          </Card>
                 <a
      href="https://ttcitymillennia.net.vn/"
      target="_blank"
     
    >
          <Card
            shadow="sm"
            radius="md"
            withBorder
            padding="0"
            className={styles.card}
          >
            <Image
              src="/image/home_bg.png"
              height={160}
              alt="Millenia City"
              style={{
                borderTopLeftRadius: "var(--mantine-radius-md)",
                borderTopRightRadius: "var(--mantine-radius-md)",
              }}
            />
            <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
              <Text fw={500}>Millenia City</Text>
              <Text size="sm" c="dimmed">
                Huyện Cần Giuộc - Tỉnh Long An
              </Text>
            </Stack>
            {/* <Button
              component="a"
              href=""
              className={`${styles.baseButton} ${styles.primaryButton}`}
            >
              Đi tới dự án
            </Button> */}
          </Card>
          </a>

          {/* Card 2 */}
          <Card
            shadow="sm"
            radius="md"
            withBorder
            padding="0"
            className={styles.card}
          >
            <Image
              src="/image/home_bg4.png"
              height={160}
              alt="Khu Dân cư Phước Thọ"
              style={{
                borderTopLeftRadius: "var(--mantine-radius-md)",
                borderTopRightRadius: "var(--mantine-radius-md)",
              }}
            />
            <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
              <Text fw={500}>Khu Dân cư Phước Thọ</Text>
              <Text size="sm" c="dimmed">
                Thành Phố Vĩnh Long
              </Text>
            </Stack>
            {/* <Button
              component="a"
              href=""
              className={`${styles.baseButton} ${styles.primaryButton}`}
            >
              Đi tới dự án
            </Button> */}
          </Card>
        </div>
          <div className={styles.footerwrapper}>
             <Text className={styles.footersubtex} fw={600} size="lg" ta="center" mb="sm" c="#762f0b">
  Giới thiệu mô hình dự án
</Text>
          
            <p className={styles.footerline}>
              
              <span>   Giới thiệu mô hình dự án: 
Hai mô hình quy hoạch dự án Millennia City (tỷ lệ 1:500) và Khu Dân cư Phước Thọ (tỷ lệ 1:200) là kết quả của sự hợp tác tin cậy giữa Tập đoàn T&T Group và Công ty TNHH Mô hình Việt, đơn vị tiên phong trong lĩnh vực thiết kế mô hình kiến trúc. Các mô hình được thực hiện với yêu cầu cao về độ chính xác, tính thẩm mỹ và khả năng ứng dụng thực tế.
Cụ thể, mỗi mô hình được trang bị hệ thống quản lý dữ liệu bán hàng và điều khiển ánh sáng qua nền tảng website, giúp người dùng dễ dàng theo dõi và cập nhật trạng thái của từng sản phẩm một cách trực quan. Bên cạnh đó, hệ thống còn tích hợp CRM (Customer Relationship Management), giúp doanh nghiệp xây dựng, duy trì và phát triển mối quan hệ tốt đẹp với khách hàng, nâng cao hiệu quả bán hàng và tăng trưởng kinh doanh.
Đặc biệt, mỗi mô hình dự án được T&T Group và Mô hình Việt lựa chọn một giải pháp công nghệ riêng phù hợp: Mô hình dự án Khu Dân cư Phước Thọ ứng dụng AR cho trải nghiệm tương tác sinh động, trong khi mô hình dự án Millennia City sử dụng Projection Mapping tạo hiệu ứng ánh sáng ấn tượng, âm thanh sống động, nâng tầm trải nghiệm và cảm xúc của người xem.
</span>
             
                 
               
             
            </p>
           </div>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { Card, Image, Text, Loader, Stack } from "@mantine/core";
// import styles from "./Interact.module.css";
// import { getListProject } from "../../api/apigetlistProjectBasic";

// interface Project {
//   id: string;
//   name: string;
//     type?: string | null;
//       address?: string | null;
//   overview_image?: string | null;
//    investor?: string | null;
// }

// export default function DetailInteractive() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token") ?? "";

//     async function fetchProjects() {
//       try {
//         const { data } = await getListProject({ token, skip: 0, limit: 20 });
//         setProjects(data);
//       } catch (error) {
//         console.error("Failed to fetch projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProjects();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: 100 }}>
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className={styles.background}>
//       <div className={styles.container}>
//         <div className={styles.cardGrid}>
//           {projects.map((project) => (
//             <Card
//               key={project.id}
//               shadow="sm"
//               radius="md"
//               withBorder
//               padding="0"
//               className={styles.card}
//             >
//               <Image
//                 src={project.overview_image || "/placeholder.png"}
//                 height={160}
//                 alt={project.name}
//                 style={{
//                   borderTopLeftRadius: "var(--mantine-radius-md)",
//                   borderTopRightRadius: "var(--mantine-radius-md)",
//                 }}
//               />
//             <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
//                              <Text fw={500}>{project.name}</Text>
//                               <Text size="sm" c="dimmed">
//                                Loại dự án: {project.type || "Thông tin chưa có"}
//                              </Text>
//                              <Text size="sm" c="dimmed">
//                                Địa chỉ: {project.address || "Địa chỉ chưa có"}
//                              </Text>
//                              <Text size="sm" c="dimmed">
//                                Nhà đầu tư: {project.investor || "Thông tin chưa có"}
//                              </Text>
//                                  {/* <Text size="sm" c="dimmed">
//                                Rank của bạn trong dự án: {project. rank_name || "Thông tin chưa có"}
//                              </Text> */}
                            
//                            </Stack>
//             </Card>
//           ))}
//         </div>
//              <div className={styles.footerwrapper}>
//              <Text className={styles.footersubtex} fw={600} size="lg" ta="center" mb="sm" c="#762f0b">
//   Giới thiệu mô hình dự án
// </Text>
          
//             <p className={styles.footerline}>
              
//               <span>   Giới thiệu mô hình dự án: 
// Hai mô hình quy hoạch dự án Millennia City (tỷ lệ 1:500) và Khu Dân cư Phước Thọ (tỷ lệ 1:200) là kết quả của sự hợp tác tin cậy giữa Tập đoàn T&T Group và Công ty TNHH Mô hình Việt, đơn vị tiên phong trong lĩnh vực thiết kế mô hình kiến trúc. Các mô hình được thực hiện với yêu cầu cao về độ chính xác, tính thẩm mỹ và khả năng ứng dụng thực tế.
// Cụ thể, mỗi mô hình được trang bị hệ thống quản lý dữ liệu bán hàng và điều khiển ánh sáng qua nền tảng website, giúp người dùng dễ dàng theo dõi và cập nhật trạng thái của từng sản phẩm một cách trực quan. Bên cạnh đó, hệ thống còn tích hợp CRM (Customer Relationship Management), giúp doanh nghiệp xây dựng, duy trì và phát triển mối quan hệ tốt đẹp với khách hàng, nâng cao hiệu quả bán hàng và tăng trưởng kinh doanh.
// Đặc biệt, mỗi mô hình dự án được T&T Group và Mô hình Việt lựa chọn một giải pháp công nghệ riêng phù hợp: Mô hình dự án Khu Dân cư Phước Thọ ứng dụng AR cho trải nghiệm tương tác sinh động, trong khi mô hình dự án Millennia City sử dụng Projection Mapping tạo hiệu ứng ánh sáng ấn tượng, âm thanh sống động, nâng tầm trải nghiệm và cảm xúc của người xem.
// </span>
             
                 
               
             
//             </p>
//            </div>
//       </div>
//     </div>
//   );
// }
