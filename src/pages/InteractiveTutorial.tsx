import { InteractiveTutorial } from "@/components/InteractiveTutorial";
import { useSafeAreaInsets } from "@/hooks/useSafeAreaInsets";

const InteractiveTutorialPage = () => {
  const { insets } = useSafeAreaInsets();

  return (
    <div 
      className="h-screen w-full bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        boxSizing: 'border-box',
      }}
    >
      <InteractiveTutorial />
    </div>
  );
};

export default InteractiveTutorialPage;
