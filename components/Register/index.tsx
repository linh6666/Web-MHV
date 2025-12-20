"use client";

import {
  Anchor,
  Box,
  Button,
  MultiSelect,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { registerUser } from "../../api/apiRegister";
import { getListProvinces } from "../../api/apigetlistaddress";
import { getWardsByProvince } from "../../api/apigetlistProvinces";
import { NotificationExtension } from "../../extension/NotificationExtension";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import style from "./Register.module.css";
import AppContainer from "../../common/AppContainer";

interface Register {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  province: string[];
  ward: string[];
  introducer: string;
  detal_address: string;
}
interface Province {
  code: string;
  full_name_vi: string;
}
interface Ward {
  code: string;
  full_name_vi: string;
}

const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<Register>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      province: [],
      ward: [],
      introducer: "",
      detal_address: "",
    },
    validate: {
      fullName: (value) =>
        value && value.trim() ? null : "Họ và tên không được để trống",
      phone: (value) =>
        /^\d{10}$/.test(value.trim()) ? null : "Số điện thoại nhập đúng 10 số!",
      password: (value) =>
        value && value.length >= 5 && value.length <= 100
          ? null
          : "Mật khẩu phải chứa từ 5 đến 100 kí tự",
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ",
      detal_address: (value) =>
        value && value.trim() ? null : "Vui lòng nhập địa chỉ chi tiết",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [provinceOptions, setProvinceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [wardOptions, setWardOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // 🧠 state riêng cho selectedProvince (tránh useEffect bị gọi lại thừa)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Floating labels
  const [clickName, setClickName] = useState(false);
  const floatingName = clickName || form.values.fullName.length > 0 || undefined;
  const [clickPhone, setClickPhone] = useState(false);
  const floatingPhone = clickPhone || form.values.phone.length > 0 || undefined;
  const [clickPassword, setClickPassword] = useState(false);
  const floatingPassword =
    clickPassword || form.values.password.length > 0 || undefined;
  const [clickEmail, setClickEmail] = useState(false);
  const floatingEmail = clickEmail || form.values.email.length > 0 || undefined;
  const [clickProvince, setClickProvince] = useState(false);
  const floatingProvince =
    clickProvince || form.values.province.length > 0 || undefined;
  const [clickWard, setClickWard] = useState(false);
  const floatingWard = clickWard || form.values.ward.length > 0 || undefined;
  const [clickIntroducer, setClickIntroducer] = useState(false);
  const floatingIntroducer =
    clickIntroducer || form.values.introducer.length > 0 || undefined;
  const [clickDetail, setClickDetail] = useState(false);
  const floatingDetail =
    clickDetail || form.values.detal_address.length > 0 || undefined;

  // 🏙️ Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data: Province[] = await getListProvinces();
        const formatted = data.map((item) => ({
          value: item.code,
          label: item.full_name_vi,
        }));
        setProvinceOptions(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  // 🏘️ Lấy danh sách phường/xã khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      const fetchWards = async () => {
        try {
          const data: Ward[] = await getWardsByProvince(selectedProvince);
          const formatted = data.map((item) => ({
            value: item.code,
            label: item.full_name_vi,
          }));
          setWardOptions(formatted);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách phường/xã:", error);
          setWardOptions([]);
        }
      };
      fetchWards();
    } else {
      setWardOptions([]);
    }
  }, [selectedProvince]);

  // Redirect sau khi đăng ký thành công
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        router.push("/dang-nhap");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, router]);

  // Xử lý submit form
  const handleSubmit = async (values: Register) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await registerUser(
        values.fullName,
        values.email,
        values.phone,
        values.password,
        values.province[0],
        values.ward[0],
        values.detal_address
      );

      console.log("✅ Đăng ký thành công:", res);
      NotificationExtension.Success("Đăng ký thành công!");
      setSuccessMsg("Đăng ký thành công!");
    } catch (error: unknown) {
      console.error("❌ Lỗi đăng ký:", error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
        NotificationExtension.Fails(
          error.message || "Có lỗi xảy ra khi đăng ký"
        );
      } else {
        setErrorMsg("Có lỗi xảy ra khi đăng ký");
        NotificationExtension.Fails("Có lỗi xảy ra khi đăng ký");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

<AppContainer>
 <Box
      className={style.registerPage}
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Box className={style.container}>
        <Box className={style.topNavBar}>
          <Box className={style.navBarContainer}>
            <Box className={style.navBarTitle}>
              Đăng ký tài khoản vào Hệ thống
            </Box>
          </Box>
        </Box>

        <Box className={style.loginForm}>
          <Box className={style.formGroup}>
            {/* Họ và tên */}
            <div className={style.inputBox}>
              <TextInput
                label="Họ và tên"
                labelProps={{ "data-floating": floatingName }}
                withAsterisk
                mt="md"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickName(true)}
                onBlur={() => setClickName(false)}
                {...form.getInputProps("fullName")}
              />
            </div>

            {/* Email */}
            <div className={style.inputBox}>
              <TextInput
                label="Email"
                labelProps={{ "data-floating": floatingEmail }}
                withAsterisk
                mt="md"
                type="email"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickEmail(true)}
                onBlur={() => setClickEmail(false)}
                {...form.getInputProps("email")}
              />
            </div>

            {/* Số điện thoại */}
            <div className={style.inputBox}>
              <TextInput
                label="Số điện thoại"
                labelProps={{ "data-floating": floatingPhone }}
                withAsterisk
                type="number"
                mt="md"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickPhone(true)}
                onBlur={() => setClickPhone(false)}
                {...form.getInputProps("phone")}
              />
            </div>

            {/* Mật khẩu */}
            <div className={style.inputBox}>
              <PasswordInput
                label="Mật khẩu"
                labelProps={{ "data-floating": floatingPassword }}
                withAsterisk
                mt="md"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickPassword(true)}
                onBlur={() => setClickPassword(false)}
                {...form.getInputProps("password")}
              />
            </div>

            {/* Province */}
            <div className={style.inputBox}>
             <MultiSelect
  label="Tỉnh/Thành phố"
  labelProps={{ "data-floating": floatingProvince }}
  withAsterisk
  mt="md"
  data={provinceOptions}
  classNames={{
    root: style.root,
    input: style.input,
    label: style.label,
  }}
  onFocus={() => setClickProvince(true)}
  onBlur={() => setClickProvince(false)}
  value={form.values.province}
  onChange={(values) => {
    // ✅ chỉ giữ lại option cuối cùng (người dùng chọn gần nhất)
    const limited = values.slice(-1);
    form.setFieldValue("province", limited);
    setSelectedProvince(limited[0] || null);
    form.setFieldValue("ward", []); // reset phường khi đổi tỉnh
  }}
  searchable={false}
/>

            </div>

            {/* Ward */}
          {/* Ward */}
<MultiSelect
  label="Phường/Xã"
  labelProps={{ "data-floating": floatingWard }}
  withAsterisk
  mt="md"
  data={wardOptions}
  classNames={{
    root: style.root,
    input: style.input,
    label: style.label,
  }}
  onFocus={() => setClickWard(true)}
  onBlur={() => setClickWard(false)}
  value={form.values.ward}
  onChange={(values) => {
    // ✅ Chỉ giữ lại 1 phường/xã cuối cùng mà người dùng chọn
    const limited = values.slice(-1);
    form.setFieldValue("ward", limited);
  }}
  searchable={false}
/>


            {/* Mã người giới thiệu */}
            <div className={style.inputBox}>
              <TextInput
                label="Mã người giới thiệu"
                labelProps={{ "data-floating": floatingIntroducer }}
                // withAsterisk
                mt="md"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickIntroducer(true)}
                onBlur={() => setClickIntroducer(false)}
                {...form.getInputProps("introducer")}
              />
            </div>

            {/* Địa chỉ chi tiết */}
            <div className={style.inputBox}>
              <TextInput
                label="Địa chỉ chi tiết"
                labelProps={{ "data-floating": floatingDetail }}
                withAsterisk
                mt="md"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickDetail(true)}
                onBlur={() => setClickDetail(false)}
                {...form.getInputProps("detal_address")}
              />
            </div>
          </Box>
        </Box>

        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: "green", marginTop: "10px" }}>{successMsg}</p>}

        <Button className={style.btn} type="submit" loading={loading}>
          Đăng ký
        </Button>

        <Text style={{ textAlign: "center", marginTop: "16px" }}>
          Bạn đã có tài khoản?{" "}
          <Anchor href="/" size="sm" c="red">
            Đăng nhập ngay
          </Anchor>
        </Text>
      </Box>
    </Box>
</AppContainer>
   
  );
};

export default RegisterForm;
