<!--
  Title: ActivitySummary
  Catalog: HMSCore-References-V5
  Document ID: activity-summary-0000001055215648-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activity-summary-0000001055215648-V5
-->
# ActivitySummary

| Class Info |
| --- |
| public class ActivitySummary extends EnhanceParcelable Activity summary class. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [ActivitySummary](#EN-US_TOPIC_0000001055215648__section128514664212)() Constructor for **ActivitySummary**. |
| [ActivitySummary](#EN-US_TOPIC_0000001055215648__section5682124718315)(PaceSummary paceSummary, List<SamplePoint> dataSummary) Constructor for **ActivitySummary**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| PaceSummary | [getPaceSummary](#EN-US_TOPIC_0000001055215648__section13126611361)() Returns the pace summary data. |
| List<SamplePoint> | [getDataSummary](#EN-US_TOPIC_0000001055215648__section694612111665)() Returns a statistical data point list. |
| void | [setDataSummary](#EN-US_TOPIC_0000001055215648__section2919152420611)(List<SamplePoint> dataSummary) Sets a statistical data point list. |
| void | [setPaceSummary](#EN-US_TOPIC_0000001055215648__section8330193012613)(PaceSummary paceSummary) Sets the pace summary data. |

#### Public Constructors

## ActivitySummary()

| Constructor |
| --- |
| public ActivitySummary() Constructor for **ActivitySummary**. |

## ActivitySummary(PaceSummary paceSummary, List<SamplePoint> dataSummary)

| Constructor |
| --- |
| public ActivitySummary(PaceSummary paceSummary, List<SamplePoint> dataSummary) Constructor for **ActivitySummary**. |

**Parameters**

| Name | Description |
| --- | --- |
| paceSummary | Pace summary. |
| dataSummary | Statistical data points. |

#### Public Methods

## getPaceSummary()

| Method |
| --- |
| public PaceSummary getPaceSummary() Returns the pace summary data. |

**Returns**

| Type | Description |
| --- | --- |
| PaceSummary | Pace summary data. |

## getDataSummary()

| Method |
| --- |
| public List<SamplePoint> getDataSummary() Obtains the statistical data points. |

**Returns**

| Type | Description |
| --- | --- |
| List<SamplePoint> | Statistical data points. |

## setDataSummary(List<SamplePoint> dataSummary)

| Method |
| --- |
| public void setDataSummary(List<SamplePoint> dataSummary) Sets a statistical data point list. |

**Parameters**

| Name | Description |
| --- | --- |
| dataSummary | Statistical data point list. |

## setPaceSummary(PaceSummary paceSummary)

| Method |
| --- |
| public void setPaceSummary(PaceSummary paceSummary) Sets the pace summary data. |

**Parameters**

| Name | Description |
| --- | --- |
| paceSummary | Pace summary. |
