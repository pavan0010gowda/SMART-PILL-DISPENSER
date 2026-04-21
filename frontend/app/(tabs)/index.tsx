import { StatusBar } from 'expo-status-bar';
import DashboardScreen from '../../src/screens/DashboardScreen';

export default function Index() {
  return (
    <>
      <StatusBar style="auto" />
      <DashboardScreen />
    </>
  );
}