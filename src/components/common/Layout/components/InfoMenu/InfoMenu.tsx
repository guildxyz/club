import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Code, Info } from "phosphor-react"

const InfoMenu = () => (
  <Menu>
    <MenuButton as={IconButton} aria-label="Agora logo" rounded="full" h="10">
      <Icon width="1.2em" height="1.2em" as={Info} />
    </MenuButton>
    {/* have to set zIndex, otherwise the search bar's icon lays over it */}
    <MenuList border="none" shadow="md" zIndex="3">
      <MenuGroup title="Powered by agora.space" pb="2">
        <MenuItem
          py="2"
          as="a"
          target="_blank"
          href="https://agora.space/"
          rel="noopener"
          icon={<Info />}
        >
          About
        </MenuItem>
        <MenuItem
          py="2"
          as="a"
          target="_blank"
          href="https://github.com/AgoraSpaceDAO/club"
          rel="noopener"
          icon={<Code />}
        >
          Code
        </MenuItem>
      </MenuGroup>
    </MenuList>
  </Menu>
)

export default InfoMenu
