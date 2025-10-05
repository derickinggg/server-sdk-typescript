import { CallInterface } from '../components/CallInterface';
import { Header } from '../components/Header';

export default function CallPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-8">
        <CallInterface />
      </div>
    </div>
  );
}