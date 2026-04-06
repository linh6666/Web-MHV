"use client";

import { Textarea, TextInput, Button } from "@mantine/core";
import styles from "./Contact.module.css";
import useAuth from "../../hook/useAuth";
import React, { useEffect, useState } from "react";
import { createContact } from "../../api/apiCreateContact1";
import { NotificationExtension } from "../../extension/NotificationExtension";

export default function ContactPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    subject: "",
    message: "",
  });

  // Fill user info
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      subject: "",
      message: "",
    };

    if (!form.subject.trim()) {
      newErrors.subject = "Vui lòng nhập chủ đề";
    }

    if (!form.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung";
    }

    setErrors(newErrors);

    return !newErrors.subject && !newErrors.message;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();

    if (!isValid) return;

    try {
      const payload = {
        topic: form.subject,
        message: form.message,
      };

      const res = await createContact(payload);

      console.log("Create contact success:", res);

      // ⭐ Thông báo thành công
      NotificationExtension.Success("Gửi liên hệ thành công!");

      // reset form
      setForm((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (error) {
      console.error("Create contact error:", error);

      // ⭐ Thông báo lỗi
      NotificationExtension.Fails("Gửi liên hệ thất bại!");
    }
  };

  const isFormValid = form.subject.trim() && form.message.trim();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Liên hệ với chúng tôi</h1>

      <div className={styles.card}>
        <div className={styles.grid}>
          <TextInput
            label="Họ và tên"
            readOnly
            value={form.full_name}
            className={styles.input}
          />

          <TextInput
            label="Email"
            readOnly
            value={form.email}
            className={styles.input}
          />

          <TextInput
            label="Chủ đề"
            placeholder="Nhập chủ đề liên hệ..."
            value={form.subject}
            onChange={handleChange("subject")}
            error={errors.subject}
            className={styles.input}
          />

          <TextInput
            label="Số điện thoại"
            readOnly
            value={form.phone}
            className={styles.input}
          />
        </div>

        <Textarea
          label="Nội dung"
          placeholder="Nhập nội dung liên hệ..."
          minRows={4}
          value={form.message}
          onChange={handleChange("message")}
          error={errors.message}
          className={styles.textarea}
        />

        <Button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
}