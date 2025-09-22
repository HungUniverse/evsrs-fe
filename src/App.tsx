import { Button } from "@/components/ui/button";
function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button
        className="bg-green-700 hover:bg-green-900 text-white"
        size="lg"
        variant="outline"
      >
        Click me
      </Button>
    </div>
  );
}

export default App;
