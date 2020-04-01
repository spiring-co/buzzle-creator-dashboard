import FormBuilderSegment from "components/formSchemaBuilderComponents/FormBuilderSegment";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
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
    removeSegment
  } = useActions();

  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);
  const [segmentDisplay, setSegmentDisplay] = useState(false);
  const [versionDisplay, setVersionDisplay] = useState(false);
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
    setActiveIndex(0);
    setComp_name("");
    setUsedFields([]);
    setSegmentDisplay(false);
    setVersionDisplay(true);
  };
  const openSegmentsBuilder = (index, fromEdit = false) => {
    if (fromEdit) {
      setActiveVersionIndex(index);
    } else {
      setActiveVersionIndex(compositions.indexOf(comp_name));
      addVersion({ comp_name });
    }

    setVersionDisplay(false);
    setSegmentDisplay(true);
  };

  const deleteSegment = () => {
    const fields = videoObj.versions[activeVersionIndex].form.segments[
      activeIndex
    ].fields.map(i => i.name);
    setUsedFields(usedFields.filter(i => !fields.includes(i)));
    activeIndex !== 0 && goToPreviousSegment();
    removeSegment(activeVersionIndex, activeIndex);
  };

  const handleTagsChange = e => {
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
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <p>
          <strong>
            {edit ? "Edit Version Details" : "Add Version Details"}
          </strong>
        </p>
        <input
          onChange={e => {
            setValue(Math.random());
            editversionKeys(activeVersionIndex, { title: e.target.value });
          }}
          style={styles.input}
          placeholder="Enter Version Title"
          type="text"
          value={videoObj.versions[activeVersionIndex].title}
        />
        <input
          onChange={e => {
            setValue(Math.random());
            editversionKeys(activeVersionIndex, {
              description: e.target.value
            });
          }}
          style={styles.input}
          placeholder="Enter Version Description"
          type="text"
          value={videoObj.versions[activeVersionIndex].description}
        />
        <input
          onChange={e => {
            setValue(Math.random());
            editversionKeys(activeVersionIndex, { price: e.target.value });
          }}
          style={styles.input}
          placeholder="Enter Version Price"
          type="number"
          value={videoObj.versions[activeVersionIndex].price}
        />
        <p>
          <strong>{edit ? "Edit Segments" : "Add Segments"}</strong>
        </p>
        <button
          onClick={_addSegment}
          disabled={
            videoObj.versions[activeVersionIndex].form.segments.length >
            MAX_SEGMENT_COUNT
          }
          children="+ Add Segment"
        />

        <button
          onClick={deleteSegment}
          disabled={
            videoObj.versions[activeVersionIndex].form.segments.length <= 1
          }
          children="- Delete Segment"
        />
        <br />
        <button
          onClick={goToPreviousSegment}
          className="rounded _bg-state-warning"
          disabled={activeIndex < 1}
          children="< Go To previous"
        />
        <button
          onClick={goToNextSegment}
          className="rounded _bg-state-warning"
          disabled={
            activeIndex >=
            videoObj.versions[activeVersionIndex].form.segments.length - 1
          }
          children="Go Next Segment >"
        />
        <FormBuilderSegment
          usedFields={usedFields}
          setUsedFields={setUsedFields}
          activeVersionIndex={activeVersionIndex}
          activeIndex={activeIndex}
        />
        <p
          children={`On section ${activeIndex + 1} of ${
            videoObj.versions[activeVersionIndex].form.segments.length
          }`}
        />
        <button
          onClick={openVersionDisplay}
          children={edit ? "Back To Versions" : "Create Version"}
        />
      </div>
    );
  }
  if (versionDisplay) {
    return (
      <div style={{ textAlign: "center" }}>
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
          <div style={{ margin: 10 }}>
            <select onChange={e => setComp_name(e.target.value)}>
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
            </select>
            <button
              onClick={() => openSegmentsBuilder()}
              disabled={comp_name === ""}
            >
              Add
            </button>
          </div>
        )}
        <br />
        <button
          onClick={() =>
            segmentDisplay ? setSegmentDisplay(false) : setVersionDisplay(false)
          }
          disabled={!segmentDisplay && !versionDisplay}
        >
          Back
        </button>
        <button
          disabled={videoObj.versions.length === 0}
          onClick={handleSubmitForm}
        >
          {edit ? "Save Edits" : "Submit Form"}
        </button>
      </div>
    );
  }
  return (
    <div
      style={{
        textAlign: "center"
      }}
    >
      <br />
      <p>
        <strong>{edit ? "Edit Video Details" : "Fill Video Details"}</strong>
      </p>
      {!edit && <FilePicker setCompositions={setCompositions} />}
      <input
        onChange={e => editVideoKeys({ title: e.target.value })}
        style={styles.input}
        placeholder="Enter Video Title"
        type="text"
        value={videoObj.title}
      />
      <input
        onChange={e => editVideoKeys({ description: e.target.value })}
        style={styles.input}
        placeholder="Enter Video Description"
        type="text"
        value={videoObj.description}
      />
      <input
        onChange={handleTagsChange}
        style={styles.input}
        placeholder="Enter Video Tags"
        type="text"
        value={videoObj.tags.toString()}
      />

      <button onClick={openVersionDisplay}>
        {edit ? "View Versions" : "Create Versions"}
      </button>
    </div>
  );
}

export default props => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};

const styles = {
  input: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    padding: 10,
    margin: 10,
    marginRight: 30,
    marginLeft: 30,
    width: "100%",
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: "grey"
  }
};
