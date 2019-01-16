import React from "react"
import "styled-components/macro"
import { getQrBase64 } from "jr-qrcode"
import { Box, Text, Flex, Button } from "rebass"
import { Textarea } from "./FormElements"
import ResetButton from "./ResetButton"
import CopyToClipboard from "./CopyToClipboard"
import ReactToPrint from "react-to-print"
import PrintFragment from "./PrintFragment"

const Fragment = ({ fragment, index }) => {
  const printRef = React.createRef()
  const genQr = getQrBase64(fragment, {
    correctLevel: 0,
    background: "#ffffff",
    foreground: "#222222",
    padding: 4
  })

  console.log(genQr)

  return (
    <Box
      px={3}
      mb={4}
      pb={4}
      css={p => ({
        borderBottom: "1px solid",
        borderColor: p.theme.colors.gray[2]
      })}
    >
      <Text mb={2} fontWeight={700}>
        Fragment #{index + 1}
      </Text>
      <Flex alignItems="flex-start">
        <Box width={1} pr={5}>
          <Textarea
            rows="3"
            defaultValue={fragment}
            css={p => ({
              marginBottom: p.theme.space[3],
              fontSize: p.theme.fontSizes[1],
              fontFamily: p.theme.fonts.mono,
              resize: "none"
            })}
          />
          <Flex>
            <CopyToClipboard text={fragment} />
            <Button
              as="a"
              mr={2}
              download={`fragment${index + 1}QR.png`}
              href={genQr}
              css={{ cursor: "pointer" }}
            >
              Download QR code
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button css={{ cursor: "pointer" }}>
                  Print paper fragment
                </Button>
              )}
              content={() => printRef.current}
            />
          </Flex>
        </Box>
        <img src={genQr} alt="QR code containing fragment text" />
      </Flex>

      <Box css={{ display: "none" }}>
        <PrintFragment
          ref={printRef}
          index={index}
          fragment={fragment}
          qrURI={genQr}
        />
      </Box>
    </Box>
  )
}

const Fragments = ({ fragments, onReset }) => {
  return (
    <Box mt={4}>
      <ResetButton onClick={onReset} />
      {fragments.map((f, i) => (
        <Fragment key={i} index={i} fragment={f} />
      ))}
    </Box>
  )
}

export default Fragments