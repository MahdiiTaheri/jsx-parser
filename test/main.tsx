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
      <Layout id="inner-div" tagName="div" full-width="true" height="full">
        <Text
          id="text"
          is_underline="true"
          color="danger"
          size="lg"
          weight="semibold"
          as="p"
        >
          Paragraph text
        </Text>
        <Button id="login-button">Click me!!!!</Button>
        <Icon name="home" id="icon" />
      </Layout>
    </Layout>
  );
}

export default test;
