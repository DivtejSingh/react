import HomeLayout from "../layout/HomeLayout";

const WithHomeLayout = (WrapperComponent) => {
  const WithHome = (props) => (
    <HomeLayout>
      <WrapperComponent  {...props} />
    </HomeLayout>
  );
  return WithHome;
};

export default WithHomeLayout;