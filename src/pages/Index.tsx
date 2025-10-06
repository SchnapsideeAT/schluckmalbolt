import { useSafeAreaInsets } from "@/hooks/useSafeAreaInsets";

const Index = () => {
  const { insets } = useSafeAreaInsets();

  return (
    <div 
      className="flex h-screen items-center justify-center bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        boxSizing: 'border-box',
      }}
    >
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;
