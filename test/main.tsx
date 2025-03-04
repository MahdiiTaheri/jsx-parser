function test() {
  return (
    <Layout
      id="main-layout"
      tagName="main"
      display="flex"
      flexDirection="col"
      padding="4"
      margin="2"
    >
      <Layout id="inner-div" tagName="div" fullWidth="true" height="full">
        <Heading id="header" as="h6">
          login Header
        </Heading>
        <Paragraph id="paragraph-1" color="danger" size="lg" weight="semibold">
          Paragraph text
        </Paragraph>
        <Button id="login-button">Click me!!!!</Button>
      </Layout>
    </Layout>
  );
}

export default test;
