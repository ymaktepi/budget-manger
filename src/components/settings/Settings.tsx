import React from "react";
import {Input, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {OAuth2Client} from "google-auth-library";
import {google, sheets_v4} from "googleapis";
import {getClientFromStorageOrRedirect} from "../../utils/clientUtils";
import {createSpreadsheet} from "../../utils/sheetsUtils";
import {SPREADSHEET_ID} from "../constants";
import {MainContainer} from "../common/MainContainer";
import {MainItem} from "../common/MainItem";


interface ISettingsState {
    value: string;
    spreadsheetId: string | null;
    client: OAuth2Client;
    sheets: sheets_v4.Sheets;
}

class Settings extends React.Component<{}, ISettingsState> {

    constructor(props: {}) {
        super(props);
        const spreadsheetId = localStorage.getItem(SPREADSHEET_ID);
        const client = getClientFromStorageOrRedirect();
        const sheets = google.sheets({version: "v4", auth: client});
        this.state = {value: "", client, sheets, spreadsheetId};
    }

    private handleChange = (event: any) => {
        this.setState({value: event.target.value});
    };

    private handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.updateId();
        }
    };

    private updateId = () => {
        if (this.state.value !== "") {
            localStorage.setItem(SPREADSHEET_ID, this.state.value);
            this.setState({spreadsheetId: this.state.value});
        }
    };

    private createSpreadsheet = async () => {
        const id = await createSpreadsheet(this.state.sheets);
        if (id) {
            this.setState({spreadsheetId: id});
        } else {
            //this.showWarningToast("Could not create spreadsheet, probably a network issue.");
        }
        //this.setLoading(false);
    };

    render = () => {
        return (
            <MainContainer>
                <MainItem title={"Create a new spreadsheet"}>
                    <Typography variant={"body1"}>
                        If you've never used this application, the first thing you need to do is to create a
                        spreadsheet.<br/>
                        This spreadsheet will be all yours, saved as a private Google Sheet on your account.
                    </Typography>
                    <Button onClick={this.createSpreadsheet} variant={"outlined"} fullWidth>
                        Create spreadsheet
                    </Button>
                </MainItem>
                <MainItem title={"Use an existing spreadsheet"}>
                    <Typography variant={"body1"}>
                        If you've already used this application but are using it from a new device, you can use an
                        existing
                        spreadsheet. Insert your spreadsheet ID in the following form.
                    </Typography>
                    <Input placeholder={"Spreadsheet ID"}
                           value={this.state.value}
                           onKeyPress={this.handleKeyPress}
                           onChange={this.handleChange}
                           fullWidth
                    />
                    <Button onClick={this.updateId} variant={"outlined"} fullWidth>
                        Update spreadsheet ID
                    </Button>
                    <Typography variant={"body1"}>
                        Current spreadsheetID: <br/>
                        {this.state.spreadsheetId}
                    </Typography>
                </MainItem>
            </MainContainer>
        );
    };
}

export default Settings;