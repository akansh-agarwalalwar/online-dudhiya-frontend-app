import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import COLORS from "../../constants/Color";

const EditFieldModal = ({ visible, onClose, field, value, onSave, loading }) => {
    const [inputValue, setInputValue] = useState(value || "");

    const handleSave = () => {
        onSave(field, inputValue);
    };

    const getFieldLabel = () => {
        const labels = {
            name: "Name",
            username: "Username",
            phone_number: "Phone Number",
        };
        return labels[field] || field;
    };

    const getPlaceholder = () => {
        const placeholders = {
            name: "Enter your name",
            username: "Enter your username",
            phone_number: "Enter your phone number",
        };
        return placeholders[field] || `Enter ${field}`;
    };

    const getKeyboardType = () => {
        if (field === "phone_number") return "phone-pad";
        return "default";
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit {getFieldLabel()}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={COLORS.DARK} />
                        </TouchableOpacity>
                    </View>

                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{getFieldLabel()}</Text>
                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholder={getPlaceholder()}
                            placeholderTextColor={COLORS.GRAY}
                            keyboardType={getKeyboardType()}
                            autoFocus
                        />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={loading || !inputValue.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.WHITE} size="small" />
                            ) : (
                                <Text style={styles.saveText}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditFieldModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        width: "100%",
        maxWidth: 400,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.DARK,
    },
    closeButton: {
        padding: 4,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.DARK,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GRAY,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: COLORS.DARK,
        backgroundColor: COLORS.WHITE,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    saveButton: {
        backgroundColor: COLORS.PRIMARY,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.DARK,
    },
    saveText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.WHITE,
    },
});
