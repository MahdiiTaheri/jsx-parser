function ConvertedComponent() {
  return (
    <>
      <Layout
        id="section-1"
        as="section"
        fullWidth={true}
        padding={4}
        background="white"
        radius="xl"
        display="flex"
      >
        <Layout
          id="title-wrapper-1"
          as="div"
          display="flex"
          flexDirection="col"
          gap={1}
        >
          <Text id="section-1-title" as="h3">
            عنوان بخش اول
          </Text>
          <Text id="section-1-subtitle" as="p" color="muted" size="xs">
            متن توضیحات برای بخش اول
          </Text>
        </Layout>
      </Layout>
      <Layout
        id="section-2"
        as="section"
        fullWidth={true}
        padding={4}
        background="white"
        radius="xl"
        display="flex"
      >
        <Layout
          id="title-wrapper-2"
          as="div"
          display="flex"
          flexDirection="col"
          gap={1}
        >
          <Text id="section-2-title" as="h3">
            عنوان بخش دوم
          </Text>
          <Text id="section-2-subtitle" as="p" color="muted" size="xs">
            متن توضیحات برای بخش دوم
          </Text>
        </Layout>
      </Layout>
    </>
  );
}

export default ConvertedComponent;
