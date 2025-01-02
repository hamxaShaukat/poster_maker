import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from 'browser-image-compression';

interface DropzoneProps {
  onChange: (base64: string) => void;
  label: string;
  value?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<DropzoneProps> = ({ onChange, label, value, disabled }) => {
  const [base64, setBase64] = useState(value);

  const handleChange = useCallback((base64: string) => {
    onChange(base64);
  }, [onChange]);

  const handleDrop = useCallback(async (files: any) => {
    const file = files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setBase64(event.target.result);
        handleChange(event.target.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  }, [handleChange]);

  const { getRootProps, getInputProps } = useDropzone({ 
    maxFiles: 1, 
    onDrop: handleDrop, 
    disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    } 
  });

  return ( 
    <div {...getRootProps({className: 'w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700'})}>
      <input {...getInputProps()} />
      {base64 ? (
        <div className="flex items-center justify-center">
          <Image
            src={base64}
            height={96}
            width={96}
            alt="Uploaded image"
          />
        </div>
      ) : (
        <p className="text-black">{label}</p>
      )}
    </div>
  );
}

export default ImageUpload;