import React, { useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CloudinaryUpload = ({ onUploadSuccess }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    // 1. Kiểm tra xem thư viện đã tải xong chưa
    if (!window.cloudinary) {
      console.error('Cloudinary SDK chưa được tải trong index.html');
      return;
    }

    // 2. Cấu hình Widget
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dpknupfvq',
        uploadPreset: 'hotel_booking',
        sources: ['local', 'url', 'camera'], // Các nguồn cho phép lấy ảnh
        multiple: false,
        cropping: true, // Cho phép cắt ảnh
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 2000000,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          message.success('Tải ảnh lên thành công!');
          
          // Gửi link ảnh ngược về Component cha
          if (onUploadSuccess) {
            onUploadSuccess(imageUrl);
          }
        } else if (error) {
          message.error('Có lỗi xảy ra khi tải ảnh!');
        }
      }
    );
  }, [onUploadSuccess]);

  const handleOpenWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <Button 
      icon={<UploadOutlined />} 
      onClick={handleOpenWidget}
      style={{ width: '100%' }}
    >
      Chọn ảnh từ máy tính
    </Button>
  );
};

export default CloudinaryUpload;