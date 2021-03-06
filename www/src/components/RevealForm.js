import React, { useState } from "react"
import "styled-components/macro"
import { Button, Box, Text, Flex } from "rebass"
import { withFormik, FieldArray } from "formik"
import { AutoTextarea } from "./FormElements"
import get from "lodash/get"
import { combine } from "../utils/secrets"
import QRUpload from "./QRUpload"
import QRCamera from "./QRCamera"

const config = {
  mapPropsToValues: () => ({ fragments: [""] }),
  handleSubmit: ({ fragments }, { props, setStatus }) => {
    try {
      const secret = combine(fragments)
      props.onSubmit(secret)
    } catch (error) {
      setStatus({
        message:
          "You have not provided enough fragments or one of the fragments could be incorrect."
      })
    }
  }
}

const FragmentField = ({
  i,
  value,
  name,
  onChange,
  setFieldValue,
  setFieldError,
  onRemove,
  hasMultipleRows
}) => {
  const [showCamera, setShowCamera] = useState(false)
  const handleQrUpload = async res => {
    try {
      const data = await res
      setFieldValue(name, data.text)
    } catch (error) {
      setFieldError(name, "Could not detect a QR code")
    }
  }

  const handleScanQR = result => {
    setFieldValue(name, result.text)
    setTimeout(() => setShowCamera(false), 1500)
  }

  return (
    <>
      <Text fontWeight={700} color="gray.3" mb={1}>
        Fragment #{i + 1}
      </Text>
      <Flex flexDirection={["column", "row"]} mb={3}>
        <Box width={[1, 3 / 4]} pr={[0, 4]} mb={[3, 0]}>
          <AutoTextarea
            value={value}
            name={name}
            onChange={onChange}
            css={{ minHeight: "60px" }}
          />
        </Box>
        <Box width={[1, 1 / 4]}>
          <QRUpload onChange={handleQrUpload} />
          <Button
            type="button"
            onClick={() => setShowCamera(prev => !prev)}
            css={{ cursor: "pointer" }}
            mb={2}
            width={1}
          >
            Scan QR
          </Button>
          {showCamera && (
            <QRCamera
              onClose={() => setShowCamera(false)}
              onResult={handleScanQR}
            />
          )}

          {(i > 0 || hasMultipleRows) && (
            <Button
              type="button"
              border="3px solid"
              borderColor="blue"
              bg="white"
              color="blue"
              fontWeight={400}
              onClick={() => onRemove(i)}
              css={{ cursor: "pointer" }}
              width={1}
            >
              Remove
            </Button>
          )}
        </Box>
      </Flex>
    </>
  )
}

const RevealForm = ({
  handleSubmit,
  handleChange,
  values,
  errors,
  status,
  setStatus,
  setFieldValue,
  setFieldError
}) => {
  const hasMultipleRows = values.fragments.length > 1
  const handleAddNewRow = arrayHelpers => () => {
    arrayHelpers.push("")
    setStatus("")
  }

  return (
    <form onSubmit={handleSubmit}>
      {status && (
        <Text color="red" mb={2}>
          {status.message}
        </Text>
      )}
      <FieldArray
        name="fragments"
        render={arrayHelpers => (
          <>
            {values.fragments.map((f, i) => (
              <Box
                mb={3}
                css={p => ({
                  borderBottom: "1px solid",
                  borderColor: p.theme.colors.gray[2]
                })}
                key={i}
              >
                {get(errors, `fragments[${i}]`, null) && (
                  <Text color="red" mb={2}>
                    {errors.fragments[i]}
                  </Text>
                )}
                <FragmentField
                  i={i}
                  value={values.fragments[i]}
                  name={`fragments[${i}]`}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  onChange={handleChange}
                  onRemove={arrayHelpers.remove}
                  hasMultipleRows={hasMultipleRows}
                />
              </Box>
            ))}

            <Flex>
              <Button
                flex={["1 0 auto", "0 1 auto"]}
                mr={3}
                type="submit"
                border="3px solid"
                borderColor="blue"
                css={{ cursor: "pointer" }}
              >
                Reveal secret
              </Button>
              <Button
                type="button"
                flex={["1 0 auto", "0 1 auto"]}
                border="3px solid"
                borderColor="blue"
                bg="white"
                color="blue"
                fontWeight={400}
                css={{ cursor: "pointer" }}
                onClick={handleAddNewRow(arrayHelpers)}
              >
                Add new fragment
              </Button>
            </Flex>
          </>
        )}
      />
    </form>
  )
}

export default withFormik(config)(RevealForm)
