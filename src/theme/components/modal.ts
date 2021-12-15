import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: (props: Dict) => ({
    dialog: {
      borderRadius: "none",
      overflow: "hidden",
      marginTop: "auto",
      marginBottom: { base: 0, sm: "auto" },
      bgColor: "seedclub.green.900",
      bgImage: "url('/img/dark-green-bg.jpg')",
      bgSize: "cover",
      borderWidth: "0.25rem",
      borderColor: "seedclub.white",
      color: "white",
      // we can't add data attributes to the Modal component so we have
      // to prevent the focus-visible polyfill from removing shadow on
      // focus by overriding it's style with the default box-shadow
      ":focus:not([data-focus-visible-added])": {
        boxShadow: mode("lg", "dark-lg")(props),
      },
    },
    closeButton: {
      borderRadius: "full",
      top: 7,
      right: 7,
    },
    header: {
      px: { base: 6, sm: 10 },
      py: 8,
      fontFamily: "heading",
      fontSize: { base: "5xl", sm: "6xl" },
      textAlign: "center",
      fontWeight: "medium",
    },
    body: {
      px: { base: 6, sm: 10 },
      pt: { base: 1, sm: 2 },
      pb: { base: 9, sm: 10 },
    },
    footer: {
      px: { base: 6, sm: 10 },
      pt: 2,
      pb: 10,
      "> *": {
        w: "full",
      },
    },
  }),
}

export default styles
