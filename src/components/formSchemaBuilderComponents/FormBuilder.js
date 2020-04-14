import FormBuilderSegment from "components/formSchemaBuilderComponents/FormBuilderSegment";
import useActions from "contextStore/actions";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SegmentsContext, StateProvider } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FilePicker from "../FilePicker";
const MAX_SEGMENT_COUNT = 5;

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);

  const {
    addSegment,
    resetVideo,
    editversionKeys,
    editVideoKeys,
    addVersion,
    removeVersion,
    loadVideo,
    removeSegment,
  } = useActions();
  const [editVersion, setEditVersion] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);
  const [segmentDisplay, setSegmentDisplay] = useState(false);
  const [versionDisplay, setVersionDisplay] = useState(false);
  const [textLayers, setTextLayers] = useState([]);
  const [imageLayers, setImageLayers] = useState([]);
  const [pickerLayers, setPickerLayers] = useState([]);
  const [compositions, setCompositions] = useState([]);
  const [comp_name, setComp_name] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => {
    edit ? loadVideo(video) : resetVideo();
  }, []);

  const _addSegment = () => {
    addSegment(activeVersionIndex);
    setActiveIndex(activeIndex + 1);
  };
  const openVersionDisplay = () => {
    setEditVersion(false);
    setEditIndex(0);
    setActiveIndex(0);
    setComp_name("");
    setUsedFields([]);
    setSegmentDisplay(false);
    setVersionDisplay(true);
  };
  const openSegmentsBuilder = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);

      console.log(editVersion, editIndex);
    } else {
      addVersion({ comp_name });
    }
    setVersionDisplay(false);
    setSegmentDisplay(true);
  };

  const deleteSegment = () => {
    const fields = videoObj.versions[activeVersionIndex].form.segments[
      activeIndex
    ].fields.map((i) => i.name);
    setUsedFields(usedFields.filter((i) => !fields.includes(i)));
    activeIndex !== 0 && goToPreviousSegment();
    removeSegment(activeVersionIndex, activeIndex);
  };

  const handleTagsChange = (e) => {
    var tags = e.target.value.split(",");
    editVideoKeys({ tags });
  };
  const goToPreviousSegment = () => {
    setActiveIndex(activeIndex - 1);
  };
  const goToNextSegment = () => {
    setActiveIndex(activeIndex + 1);
  };

  const handleSubmitForm = async () => {
    submitForm(videoObj);
  };
  if (segmentDisplay) {
    return (
      <Form>
        <p>
          <strong>
            {edit ? "Edit Version Details" : "Add Version Details"}
          </strong>
        </p>
        <Form.Control
          onChange={(e) => {
            setValue(Math.random());
            editversionKeys(editVersion ? editIndex : activeVersionIndex, {
              title: e.target.value,
            });
          }}
          //style={styles.input}
          placeholder="Enter Version Title"
          type="text"
          value={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex]
              .title
          }
        />
        <Form.Control
          onChange={(e) => {
            setValue(Math.random());
            editversionKeys(editVersion ? editIndex : activeVersionIndex, {
              description: e.target.value,
            });
          }}
          //style={styles.input}
          placeholder="Enter Version Description"
          type="text"
          value={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex]
              .description
          }
        />
        <Form.Control
          onChange={(e) => {
            setValue(Math.random());
            editversionKeys(editVersion ? editIndex : activeVersionIndex, {
              price: e.target.value,
            });
          }}
          // style={styles.input}
          placeholder="Enter Version Price"
          type="number"
          value={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex]
              .price
          }
        />
        <p>
          <strong>{edit ? "Edit Segments" : "Add Segments"}</strong>
        </p>
        <Button
          onClick={_addSegment}
          disabled={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length > MAX_SEGMENT_COUNT
          }
          children="+ Add Segment"
        />

        <Button
          onClick={deleteSegment}
          disabled={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length <= 1
          }
          children="- Delete Segment"
        />
        <br />
        <Button
          onClick={goToPreviousSegment}
          className="rounded _bg-state-warning"
          disabled={activeIndex < 1}
          children="< Go To previous"
        />
        <Button
          onClick={goToNextSegment}
          className="rounded _bg-state-warning"
          disabled={
            activeIndex >=
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length -
              1
          }
          children="Go Next Segment >"
        />
        <FormBuilderSegment
          textLayers={textLayers}
          imageLayers={imageLayers}
          pickerLayers={pickerLayers}
          edit={edit}
          usedFields={usedFields}
          setUsedFields={setUsedFields}
          activeVersionIndex={editVersion ? editIndex : activeVersionIndex}
          activeIndex={activeIndex}
        />
        <p
          children={`On section ${activeIndex + 1} of ${
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length
          }`}
        />
        <Button
          onClick={() => {
            if (!editVersion) {
              setActiveVersionIndex(activeVersionIndex + 1);
            }
            openVersionDisplay();
          }}
          children={edit ? "Back To Versions" : "Create Version"}
        />
      </Form>
    );
  }
  if (versionDisplay) {
    return (
      <div>
        <p>{edit ? "View Versions" : "Create Versions"}</p>

        {videoObj?.versions.map((item, index) => {
          return (
            <div style={{ border: "1px solid black", padding: 10, margin: 10 }}>
              <p style={{ fontSize: 15 }}>{JSON.stringify(item)}</p>
              <button onClick={() => openSegmentsBuilder(index, true)}>
                Edit
              </button>
              <span> </span>
              <button onClick={() => removeVersion(index)}>Delete</button>
            </div>
          );
        })}
        {!edit && (
          <Form>
            <Form.Group as={Row}>
              <Col sm="7">
                <Form.Control
                  as="select"
                  value="Choose..."
                  onChange={(e) => setComp_name(e.target.value)}
                >
                  <option disabled selected value="">
                    Select Composition
                  </option>
                  {compositions.map((item, index) => {
                    return (
                      <option key={index} id={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
              <Col sm="3">
                <Button
                  // style={{ float: "right" }}
                  variant="outline-primary"
                  onClick={() => openSegmentsBuilder()}
                  disabled={comp_name === ""}
                >
                  Add
                </Button>
              </Col>
            </Form.Group>
          </Form>
        )}
        <br />
        <Button
          variant="outline-primary"
          style={{ float: "left", marginRight: "2%" }}
          onClick={() =>
            segmentDisplay ? setSegmentDisplay(false) : setVersionDisplay(false)
          }
          disabled={!segmentDisplay && !versionDisplay}
        >
          Back
        </Button>
        <Button
          style={{ float: "left" }}
          variant="outline-primary"
          disabled={videoObj.versions.length === 0}
          onClick={handleSubmitForm}
        >
          {edit ? "Save Edits" : "Submit Form"}
        </Button>
      </div>
    );
  }
  return (
    <div>
      <Form>
        <p>
          <strong>{edit ? "Edit Video Details" : "Fill Video Details"}</strong>
        </p>
        {!edit && (
          <FilePicker
            setImageLayers={setImageLayers}
            setPickerLayers={setPickerLayers}
            setTextLayers={setTextLayers}
            setCompositions={setCompositions}
          />
        )}
        <Form.Group>
          <Col sm="12">
            <Form.Control
              size="md"
              type="textarea"
              onChange={(e) => editVideoKeys({ title: e.target.value })}
              placeholder="Enter Video Title"
              type="text"
              value={videoObj.title}
            />
          </Col>
        </Form.Group>
        <Form.Group>
          <Col sm="12">
            <Form.Control
              size="md"
              onChange={(e) => editVideoKeys({ description: e.target.value })}
              //style={styles.input}
              placeholder="Enter Video Description"
              type="textarea"
              value={videoObj.description}
            />
          </Col>
        </Form.Group>

        <Form.Group>
          <Col sm="12">
            <Form.Control
              size="md"
              onChange={handleTagsChange}
              //style={styles.input}
              placeholder="Enter Video Tags"
              type="textarea"
              value={videoObj.tags.toString()}
            />
          </Col>
        </Form.Group>
      </Form>
      <Button
        style={{ position: "relative", left: "3%" }}
        variant="outline-primary"
        onClick={openVersionDisplay}
      >
        {edit ? "View Versions" : "Create Versions"}
      </Button>
    </div>
  );
}

export default (props) => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};

const styles = {
  input: {
    fontSize: 20,
    padding: 10,
    margin: 10,
    marginRight: 30,
    marginLeft: 30,
    width: "100%",
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: "grey",
  },
};
