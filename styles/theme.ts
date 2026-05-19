import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";

export const getHomeStyles = (theme: MD3Theme) => StyleSheet.create({
  mainContainer: {
    padding: 24,
    gap: 24
  },
  screenBackground: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  heroCard: {
    position: "relative",
    padding: 24,
    borderRadius: theme.roundness * 3, // Scales dynamically with your theme's roundness
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,

    // Smooth iOS shadows
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  heroGlassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surfaceVariant,
    opacity: 0.4,
  },
  heroLabel: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  heroAmount: {
    color: theme.colors.onSurface,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  pillText: {
    color: theme.colors.onSecondaryContainer,
    fontWeight: "600",
  },
  sectionContainer: {
    flexDirection: "column",
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: "700",
    marginBottom: 10,
    paddingLeft: 4,
    letterSpacing: -0.2,
  },
  glassCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  glassCardList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
    overflow: "hidden",
  },
  progressItemRow: {
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBarLine: {
    height: 8,
    borderRadius: 99,
  },
  listItemStyle: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  listSeparator: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginLeft: 60,
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
  chevronWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 4,
  },
  itemTitleText: {
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  itemDescriptionText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  mutedText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  iosActionButton: {
    borderRadius: theme.roundness * 1.5,
    marginTop: 4,
  },
  iosActionLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
});

export const getCategoriesStyles = (theme: MD3Theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background, // Clean uniform backdrop
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sortButton: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  sortButtonLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  modalBackdrop: {
    margin: 24,
    justifyContent: "center",
  },
  modalContent: {
    gap: 16,
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5, // Follows your custom theme curves
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  pickerContainer: {
    gap: 6,
  },
  pickerLabel: {
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    paddingLeft: 2,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: theme.roundness * 1.5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  picker: {
    color: theme.colors.onSurface,
  },
  modalButtonsContainer: {
    gap: 8,
    marginTop: 8,
  },
  modalActionButton: {
    borderRadius: theme.roundness * 1.5,
  },
  listContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
    overflow: "hidden",
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
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: theme.roundness * 1.5,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  chevronWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 4,
  },
  listSeparator: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginLeft: 60, // Matches icon offset for native look
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  newCategoryButton: {
    borderRadius: theme.roundness * 1.5,
    paddingHorizontal: 8,
  },
});

export const getCategoryDetailStyles = (theme: MD3Theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
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
  budgetCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    padding: 16,
    borderRadius: theme.roundness * 2.5,
    gap: 8,
    marginBottom: 16,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
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
    fontSize: 14,
    fontWeight: "600",
  },
  sortButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  sortButtonLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    overflow: "hidden",
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    marginVertical: 8,
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
    backgroundColor: theme.colors.surfaceVariant,
    marginLeft: 16,
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
    marginTop: 12,
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
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontWeight: "600",
    color: theme.colors.onSurface,
    paddingLeft: 2,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
  },
  buttonGroup: {
    gap: 10,
    marginTop: 4,
  },
  formButton: {
    borderRadius: theme.roundness * 1.5,
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
    margin: 24,
    justifyContent: "center",
  },
  modalContent: {
    gap: 16,
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  pickerContainer: {
    gap: 6,
  },
  pickerLabel: {
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    paddingLeft: 2,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: theme.roundness * 1.5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  picker: {
    color: theme.colors.onSurface,
  },
  modalButtonsContainer: {
    gap: 8,
    marginTop: 8,
  },
  modalActionButton: {
    borderRadius: theme.roundness * 1.5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.surfaceVariant,
  },
});

export const getExpenseStyles = (theme: MD3Theme) => StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontWeight: "600",
    color: theme.colors.onSurface,
    paddingLeft: 2,
  },
  requiredAsterisk: {
    color: theme.colors.error,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
  },
  spinnerContainer: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderRadius: theme.roundness * 1.5,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGroup: {
    gap: 10,
    marginTop: 4,
  },
  formButton: {
    borderRadius: theme.roundness * 1.5,
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
    fontSize: 16,
  },
  modalBackdrop: {
    margin: 24,
    justifyContent: "center",
  },
  modalContent: {
    gap: 16,
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  modalActionButton: {
    borderRadius: theme.roundness * 1.5,
  },
  modalTitle: {
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
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
});

export const getSettingsStyles = (theme: MD3Theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionContainer: {
    gap: 8,
    marginBottom: 24,
  },
  sectionLabel: {
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    paddingLeft: 2,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: theme.roundness * 1.5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  picker: {
    color: theme.colors.onSurface,
  },
  actionButton: {
    borderRadius: theme.roundness * 1.5,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    padding: 20,
    borderRadius: theme.roundness * 2.5,
    gap: 20,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  infoTitle: {
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  textGroup: {
    gap: 4,
  },
  infoText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
  },
  socialsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 28,
    paddingVertical: 4,
  },
  socialTouchTarget: {
    padding: 4,
  },
  developerButton: {
    marginTop: 8,
    borderRadius: theme.roundness * 1.5,
  },
});