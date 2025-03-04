function test() {
  return (
    <Layout
      id="main-layout"
      tagName="main"
      display="flex"
      flex_direction="col"
      padding="4"
      margin="2"
    >
      <Layout id="inner-div" tagName="div" full_width="true" height="full">
        <Text id="header" as="h6">
          login Header
        </Text>
        <Text id="paragraph-1" color="danger" size="lg" weight="semibold">
          Paragraph text
        </Text>
        <Button id="login-button">Click me</Button>
      </Layout>
    </Layout>
  );
}

export default test;
