import {Grid, Text, Topbar} from "@/components";
import { BarChart, PieChart, PopulationPyramid, LineChart   } from "react-native-gifted-charts";
import {ScrollView} from "react-native";

export default function DashboardScreen() {
    const barData = [
        {value: 250, label: 'M'},
        {value: 500, label: 'T', frontColor: '#177AD5'},
        {value: 745, label: 'W', frontColor: '#177AD5'},
        {value: 320, label: 'T'},
        {value: 600, label: 'F', frontColor: '#177AD5'},
        {value: 256, label: 'S'},
        {value: 300, label: 'S'},
    ];
    const pieData = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];
    const pyramidData = [
        {left: 15, right: 17},
        {left: 30, right: 27},
        {left: 26, right: 25},
        {left: 40, right: 44}
    ];
    const lineData = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];

    return (
        <Grid>
            <Topbar title="Dashboard"/>
            <ScrollView>
                <Grid style={{
                    padding: 16
                }}>
                    <Text>Bar Chart:</Text>
                    <BarChart
                        barWidth={22}
                        noOfSections={3}
                        barBorderRadius={4}
                        frontColor="lightgray"
                        data={barData}
                        yAxisThickness={0}
                        xAxisThickness={0}
                    />
                </Grid>
                <Grid style={{
                    padding: 16
                }}>
                    <Text>Pie Chart:</Text>
                    <PieChart data={pieData}/>
                </Grid>
                <Grid style={{
                    padding: 16,
                }}>
                    <Text>Line Chart:</Text>
                    <LineChart
                        areaChart
                        data={lineData}
                        startFillColor="rgb(46, 217, 255)"
                        startOpacity={0.8}
                        endFillColor="rgb(203, 241, 250)"
                        endOpacity={0.3}
                    />
                </Grid>
                <Grid style={{
                    padding: 16,
                    marginBottom: 100
                }}>
                    <Text>Pyramid Chart:</Text>
                    <PopulationPyramid data={pyramidData}/>
                </Grid>
            </ScrollView>
        </Grid>
    );
}
