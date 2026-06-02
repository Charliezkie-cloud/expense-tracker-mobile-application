import {MD3Theme} from "react-native-paper";
import {StyleSheet} from "react-native";

export const getCategoryDetailStyles = (theme: MD3Theme) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: theme.roundness * 1.5,
        backgroundColor: theme.colors.secondaryContainer,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 4,
    },
    totalDisplayContainer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    totalAmountText: {
        fontWeight: "800",
        color: theme.colors.onSurface,
        letterSpacing: -1,
    },
    glassCard: {
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.11)"
            : "rgba(255, 255, 255, 0.78)",
        borderRadius: theme.roundness * 4,
        padding: 18,
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.75)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 0,
        marginBottom: 16,
    },
    budgetCard: {
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.09)"
            : "rgba(255, 255, 255, 0.78)",
        borderRadius: theme.roundness * 4,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.75)",
        gap: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 0,
    },
    budgetTextRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    budgetTextLabel: {
        color: theme.colors.onSurfaceVariant,
        fontWeight: "500",
    },
    budgetTextValue: {
        color: theme.colors.onSurface,
        fontWeight: "600",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    splitButton: {
        flex: 1,
        borderRadius: theme.roundness * 1.5,
    },
    splitButtonLabel: {
        fontWeight: "600",
    },
    sortButton: {
        alignSelf: "flex-start",
        marginBottom: 8,
        width: "100%"
    },
    sortButtonLabel: {
        fontWeight: "600",
    },
    listContainer: {
        flex: 1,
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.07)"
            : "rgba(255, 255, 255, 0.78)",
        borderRadius: theme.roundness * 4,
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.75)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        overflow: "hidden",
        marginVertical: 8,
        padding: 4,
    },
    listItemStyle: {
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    itemTitleText: {
        fontWeight: "600",
        color: theme.colors.onSurface,
    },
    itemDescriptionText: {
        color: theme.colors.onSurfaceVariant,
        marginTop: 2,
    },
    chevronWrapper: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 4,
    },
    listSeparator: {
        height: 1,
        backgroundColor: theme.dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        marginLeft: 64,
    },
    emptyContainer: {
        paddingVertical: 48,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        textAlign: "center",
        color: theme.colors.onSurfaceVariant,
        fontWeight: "500",
    },
    actionFooter: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: "auto",
    },
    primaryActionButton: {
        borderRadius: theme.roundness * 1.5,
        paddingHorizontal: 8,
    },
    formContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
        gap: 20,
        position: "relative",
    },
    categoryLiquidShape1: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: theme.colors.primary,
        opacity: 0.16,
        top: -30,
        right: -40,
    },
    categoryLiquidShape2: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: theme.colors.tertiary || "#A855F7",
        opacity: 0.12,
        bottom: 80,
        left: -50,
    },
    categoryLiquidShape3: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.secondary,
        opacity: 0.08,
        top: "35%",
        right: "15%",
    },
    categoryGlassOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.background,
        opacity: 0.22,
    },
    glassInputCard: {
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.09)"
            : "rgba(255, 255, 255, 0.78)",
        borderRadius: theme.roundness * 4,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.75)",
        gap: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 0,
    },
    inputGroup: {
        gap: 10,
    },
    inputLabel: {
        fontWeight: "800",
        color: theme.colors.onSurface,
        paddingLeft: 4,
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },
    textInput: {
        backgroundColor: theme.dark
            ? "rgba(0, 0, 0, 0.22)"
            : "rgba(255, 255, 255, 0.45)",
        borderRadius: theme.roundness * 2.5,
    },
    suggestionsContainer: {
        flex: 1,
        gap: 10,
    },
    suggestionsTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    suggestionsTitle: {
        fontWeight: "800",
        color: theme.colors.onSurfaceVariant,
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
    suggestionsListContainer: {
        flex: 1,
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.07)"
            : "rgba(255, 255, 255, 0.78)",
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.75)",
        borderWidth: 1,
        borderRadius: theme.roundness * 4,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
        overflow: "hidden",
        elevation: 0,
    },
    suggestionsList: {
        flex: 1,
    },
    suggestionsListItem: {
        flex: 1,
        margin: 5,
        borderRadius: theme.roundness * 2.5,
        overflow: "hidden",
    },
    chipItemInner: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: theme.roundness * 2.5,
        borderWidth: 1,
    },
    chipText: {
        marginLeft: 10,
        fontWeight: "700",
    },
    buttonGroup: {
        gap: 12,
        marginTop: 8,
    },
    formButton: {
        borderRadius: theme.roundness * 3,
        paddingVertical: 8,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
    },
    dangerSection: {
        marginTop: "auto",
        paddingBottom: 8,
    },
    dangerButton: {
        borderRadius: theme.roundness * 1.5,
        borderColor: theme.colors.error,
    },
    dangerButtonLabel: {
        color: theme.colors.error,
        fontWeight: "600",
    },
    modalBackdrop: {
        margin: 0,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        gap: 22,
        paddingTop: 10,
        paddingBottom: 36,
        paddingHorizontal: 24,
        backgroundColor: theme.dark
            ? "rgba(18, 20, 32, 1)"
            : "rgba(255, 255, 255, 1)",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
    },
    sheetHandle: {
        width: 38,
        height: 5,
        borderRadius: 99,
        backgroundColor: theme.dark ? "rgba(255, 255, 255, 0.15)" : "rgba(0,0,0,0.12)",
        alignSelf: "center",
        marginBottom: 8,
    },
    modalTitle: {
        fontWeight: "800",
        color: theme.colors.onSurface,
        textAlign: "center",
        letterSpacing: -0.3,
        marginBottom: 6,
    },
    pickerContainer: {
        gap: 10,
    },
    pickerLabel: {
        fontWeight: "800",
        color: theme.colors.primary,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        paddingLeft: 4,
    },
    pickerWrapper: {
        backgroundColor: theme.dark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.02)",
        borderRadius: theme.roundness * 2.5,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.06)",
    },
    picker: {
        color: theme.colors.onSurface,
    },
    modalButtonsContainer: {
        gap: 12,
        marginTop: 14,
    },
    modalActionButton: {
        borderRadius: theme.roundness * 3,
        paddingVertical: 8,
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.surfaceVariant,
    },
});

export const getExpenseDetailStyles = (theme: MD3Theme) => StyleSheet.create({
    formContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
        gap: 20,
        position: "relative",
    },
    categoryLiquidShape1: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: theme.colors.primary,
        opacity: 0.16,
        top: -30,
        right: -40,
    },
    categoryLiquidShape2: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: theme.colors.tertiary || "#A855F7",
        opacity: 0.12,
        bottom: 80,
        left: -50,
    },
    categoryLiquidShape3: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.secondary,
        opacity: 0.08,
        top: "35%",
        right: "15%",
    },
    categoryGlassOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.background,
        opacity: 0.22,
    },
    glassInputCard: {
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.11)"
            : "rgba(255, 255, 255, 0.78)",
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.75)",
        borderRadius: theme.roundness * 3.5,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 0,
        gap: 16,
    },
    inputGroup: {
        gap: 10,
    },
    inputLabel: {
        fontWeight: "800",
        color: theme.colors.onSurface,
        paddingLeft: 4,
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },
    requiredAsterisk: {
        color: theme.colors.error,
    },
    textInput: {
        backgroundColor: theme.dark
            ? "rgba(0, 0, 0, 0.22)"
            : "rgba(255, 255, 255, 0.45)",
        borderRadius: theme.roundness * 2.5,
    },
    spinnerContainer: {
        backgroundColor: theme.dark
            ? "rgba(0, 0, 0, 0.15)"
            : "rgba(255, 255, 255, 0.25)",
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        borderWidth: 1,
        borderRadius: theme.roundness * 2.5,
        padding: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonGroup: {
        gap: 10,
        marginTop: 4,
    },
    formButton: {
        borderRadius: theme.roundness * 3,
        paddingVertical: 8,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
    },
    dangerSection: {
        marginTop: "auto",
        paddingBottom: 8,
    },
    dangerButton: {
        borderRadius: theme.roundness * 3,
        borderColor: theme.colors.error,
        borderWidth: 1.5,
    },
    dangerButtonLabel: {
        color: theme.colors.error,
        letterSpacing: 0.3,
    },
    modalBackdrop: {
        margin: 0,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        gap: 22,
        paddingTop: 10,
        paddingBottom: 36,
        paddingHorizontal: 24,
        backgroundColor: theme.dark
            ? "rgba(18, 20, 32, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        borderWidth: 1,
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.75)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
        elevation: 0,
    },
    sheetHandle: {
        width: 38,
        height: 5,
        borderRadius: 99,
        backgroundColor: theme.dark ? "rgba(255, 255, 255, 0.15)" : "rgba(0,0,0,0.12)",
        alignSelf: "center",
        marginBottom: 8,
    },
    modalActionButton: {
        borderRadius: theme.roundness * 3,
        paddingVertical: 6,
    },
    modalTitle: {
        fontWeight: "800",
        color: theme.colors.onSurface,
        textAlign: "center",
        letterSpacing: -0.3,
        marginBottom: 6,
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.surfaceVariant,
    },
    detailsLabel: {
        color: theme.colors.onSurfaceVariant,
    },
    detailsValue: {
        fontWeight: "600",
        color: theme.colors.onSurface,
    },
    suggestionsListContainer: {
        flex: 1,
        backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.07)"
            : "rgba(255, 255, 255, 0.78)",
        borderColor: theme.dark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.75)",
        borderWidth: 1,
        borderRadius: theme.roundness * 4,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
        overflow: "hidden",
        elevation: 0,
        gap: 10
    },
    suggestionsList: {
        flex: 1,
    },
    suggestionsListItem: {
        flex: 1,
        margin: 5,
        borderRadius: theme.roundness * 2.5,
        overflow: "hidden",
    },
    listItemWrapper: {
        borderRadius: theme.roundness * 3,
        overflow: "hidden",
    },
    listItemInner: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "center",
    },
    itemTitleText: {
        fontWeight: "700",
        color: theme.colors.onSurface,
        letterSpacing: -0.1,
    },
    itemDescriptionText: {
        color: theme.colors.onSurfaceVariant,
        marginTop: 4,
        fontWeight: "600",
        opacity: 0.82,
    },
    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: theme.roundness * 2.2,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    emptyContainer: {
        paddingVertical: 56,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },
    emptyText: {
        textAlign: "center",
        color: theme.colors.onSurfaceVariant,
        fontWeight: "600",
    },
    iosActionButton: {
        borderRadius: theme.roundness * 2,
        marginTop: 6,
    },
    iosActionLabel: {
        fontWeight: "700",
    },
});