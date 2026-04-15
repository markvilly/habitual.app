import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { StoreProvider } from "./src/stores";
import Navigation from "./src/navigation";
import axios from 'axios';
import { LogBox } from 'react-native';



LogBox.ignoreLogs(['SafeAreaView has been deprecated']);


axios.interceptors.request.use(request => {
  console.log(`→ ${request.method?.toUpperCase()} ${request.url}`, request.data ?? '');
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log(`← ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.log(`✗ ${error.response?.status} ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);


export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <AuthProvider>
          <Navigation />
          <StatusBar style="auto" />
        </AuthProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
