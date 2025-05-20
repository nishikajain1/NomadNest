import { useRef, useEffect } from "react";

const QRCodeModal = ({ isOpen, onClose, qrCodeSrc }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} style={styles.dialog}>
            <button onClick={onClose} style={styles.closeButton}>✖</button>
            <img src={qrCodeSrc} alt="QR Code" style={styles.image} />
        </dialog>
    );
};

const styles = {
    dialog: {
        border: "none",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
    },
    closeButton: {
        float: "right",
        border: "none",
        background: "none",
        fontSize: "18px",
        cursor: "pointer",
    },
    image: {
        width: "200px",
        height: "200px",
    },
};

export default QRCodeModal;
