/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import {
  Button, ButtonToolbar,
} from 'reactstrap';
import XLSX from 'xlsx';
import { connect } from 'react-redux';
import moment from 'moment';
import { MakeCols } from './makeColumns';
import { uploadFileMora } from '../../../redux/actions/uploadFileActions';
import { SheetJSFT } from './types';

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      data: [],
      cols: [],
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { files } = e.target;
    if (files && files[0]) this.setState({ file: files[0] });
  }

  handleFile() {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true, cellDates: true });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const arrMora = {
        action: 'dayInArreas',
        data: [],
      };
      let info = {};

      this.setState({ data, cols: MakeCols(ws['!ref']) }, () => {
        // console.log('info de file', this.state.data);
        this.state.data.map((element) => {
          // if (element.Capital) {
          // console.log('info de file', moment(element.Vencimiento));
          // } else {
          //   console.log('no existe');
          // }
          info = {
            idCases: element.ID ? element.ID : undefined,
            judicial: element.Judicial ? element.Judicial : undefined,
            dayInArreas: element.Mora ? element.Mora : 0,
            expiration: element.Vencimiento ? moment(element.Vencimiento) : undefined,
          };
          arrMora.data.push(info);
          info = {};
        });
      });
      // console.log(JSON.stringify(this.state.data, null, 2));
      // console.log('EL JSON', arrMora);
      this.props.uploadFileMora(arrMora);
    };

    if (!this.state.file) {
      alert('Ingresar un archivo');
    } else {
      reader.readAsBinaryString(this.state.file);
    }
  }


  render() {
    return (
      <Fragment>
        <div>
          <br />
          <div className="dropzone dropzone--single">
            <div className="dropzone__input">
              <div className="dropzone__drop-here">
                <input
                  type="file"
                  id="file"
                  accept={SheetJSFT}
                  // style={{ display: 'none' }}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <br />
        </div>
        <ButtonToolbar className="form__button-toolbar" style={{ justifyContent: 'flex-end' }}>
          <Button style={{ backgroundColor: '#595959', color: '#fff' }} onClick={this.handleFile} type="submit">Subir</Button>
        </ButtonToolbar>
      </Fragment>

    );
  }
}

const mapDispatchToProps = {
  uploadFileMora,
};

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(ExcelReader);
