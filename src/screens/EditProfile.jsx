import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { ChevronLeft, Camera } from "lucide-react-native";
import COLORS from "../constants/Color";
import ProfileRow from "../components/common/ProfileRow";
import AppHeader from "../components/common/AppHeader";

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: "Haseeb Jameel",
    username: "Droply",
    email: "haseeb.jameel9570@gmail.com",
    birthdate: "04-July-2004",
    gender: "Male",
    weight: "55 kg",
    height: "5ft 6inch",
  });

  // Example handler
  const openEditModal = (field) => {
    console.log("Editing:", field);
  };

  return (
    <View style={styles.container}>
        <AppHeader
            title="Edit Profile"
            showBackButton
            onBackPress={() => navigation.goBack()}
        />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={18} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <ProfileRow
            label="Name"
            value={profile.name}
            onPress={() => openEditModal("name")}
          />
          <ProfileRow
            label="Dropl y"
            value={profile.username}
            onPress={() => openEditModal("username")}
          />
        </View>

        {/* Private Information Title */}
        <Text style={styles.sectionTitle}>Private Information</Text>

        {/* Private Info Card */}
        <View style={styles.card}>
          <ProfileRow
            label="Email"
            value={profile.email}
            onPress={() => openEditModal("email")}
          />
          <ProfileRow
            label="Birthdate"
            value={profile.birthdate}
            onPress={() => openEditModal("birthdate")}
          />
          <ProfileRow
            label="Gender"
            value={profile.gender}
            onPress={() => openEditModal("gender")}
          />
          <ProfileRow
            label="Weight"
            value={profile.weight}
            onPress={() => openEditModal("weight")}
          />
          <ProfileRow
            label="Height"
            value={profile.height}
            onPress={() => openEditModal("height")}
          />
        </View>

        <View style={{ height: 50 }} />

      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.DARK,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },
  cameraButton: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    padding: 6,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 10,
    fontWeight: "600",
  },
});
